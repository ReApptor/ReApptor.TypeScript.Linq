using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using StackExchange.Redis;
using WeAre.Athenaeum.Cache.Interface;
using WeAre.Athenaeum.Cache.Models;

namespace WeAre.Athenaeum.Cache.Implementation
{
    public class RedisCache : ICacheService
    {
        #region Fields

        private readonly IDatabase _cache;
        private readonly ILogger<RedisCache> _logger;
        private readonly IConnectionMultiplexer _connectionMultiplexer;
        private readonly RedisSettings _settings;

        #endregion

        #region Constructor

        public RedisCache(ILogger<RedisCache> logger, IConnectionMultiplexer connectionMultiplexer, RedisSettings settings)
        {
            _logger = logger;
            _connectionMultiplexer = connectionMultiplexer;
            _settings = settings;
            _cache = connectionMultiplexer.GetDatabase();
        }

        #endregion

        #region Implementation

        public async Task<T> GetAsync<T>(string cacheKey, params object[] identifier)
        {
            string keyToFetch = string.Empty;
            try
            {
                (RedisKey hashKey, string key) = FormatKey(cacheKey, identifier);
                keyToFetch = key;
                T fromCache = await GetFromCacheAsync<T>(hashKey, key);

                return fromCache;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error with getting key \"{keyToFetch}\" from cache.");
                return default(T);
            }
        }

        public async Task SaveAsync(string cacheKey, object obj, params object[] identifier)
        {
            await SaveAsync(cacheKey, obj, TimeSpan.FromHours(24), identifier);
        }


        public async Task SaveAsync(string cacheKey, object obj, TimeSpan? cacheDuration, params object[] identifier)
        {
            TimeSpan duration = cacheDuration ?? TimeSpan.FromHours(24);

            DateTime expiration = DateTime.UtcNow.Add(duration);
            (RedisKey hashKey, string key) = FormatKey(cacheKey, identifier);
            await SaveToCacheAsync(hashKey, obj, key, expiration);
        }

        public async Task InvalidateCacheAsync(string[] cacheKeys, params object[] identifier)
        {
            foreach (string a in cacheKeys)
            {
                (RedisKey hashKey, string key) = FormatKey(a, identifier);
                await _cache.HashDeleteAsync(hashKey, key);
            }
        }

        public async Task ClearFolder(params string[] cacheKeys)
        {
            foreach (string a in cacheKeys)
            {
                (RedisKey hashKey, string _) = FormatKey(a);
                await _cache.KeyDeleteAsync(hashKey);
            }
        }

        public async Task ClearAll()
        {
            string keyToScan = $"{_settings.CacheName}*";

            IEnumerable<RedisKey> keysToDelete = GetKeysAsync(keyToScan);

            foreach (RedisKey key in keysToDelete)
            {
                await _cache.KeyDeleteAsync(key);
                _logger.LogDebug($"Removing Key {key.ToString()} from cache");
            }
        }

        public async Task ClearEntry(string cacheKey, Guid entityId)
        {
            (RedisKey hashKey, string key) = FormatKey(cacheKey, entityId);

            HashEntry[] allHashKeys = await _cache.HashGetAllAsync(hashKey);
            foreach (HashEntry hasEntry in allHashKeys)
            {
                if (hasEntry.Name.StartsWith(key))
                {
                    await _cache.HashDeleteAsync(hashKey, hasEntry.Name);
                }
            }
        }

        private IEnumerable<RedisKey> GetKeysAsync(string key)
        {
            IServer server = GetServer();
            IEnumerable<RedisKey> keys = server.Keys(pattern: $"{key}", pageSize: 1000);

            return keys;
        }

        private IServer GetServer()
        {
            EndPoint[] endpoints = _connectionMultiplexer.GetEndPoints();
            IServer server = _connectionMultiplexer.GetServer(endpoints.First());
            return server;
        }

        #endregion implementation

        #region private

        /// <summary>
        /// Gets key from cache
        /// </summary>
        /// <param name="hashKey">parent key</param>
        /// <param name="key">key to get</param>
        /// <returns>value in json format</returns>
        private async Task<TItem> GetFromCacheAsync<TItem>(RedisKey hashKey, string key)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(key))
                {
                    throw new ArgumentException(nameof(key));
                }

                string jsonObject = await _cache.HashGetAsync(hashKey, key);

                if (jsonObject == null)
                {
                    return default;
                }

                var deserialized = JsonConvert.DeserializeObject<CacheObject<TItem>>(jsonObject);

                if (deserialized == null)
                {
                    return default;
                }

                if (DateTime.UtcNow > deserialized.Expiration)
                {
                    await _cache.HashDeleteAsync(hashKey, key);
                    return default;
                }

                return deserialized.Data;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error with getting item with key \"{key}\" from cache.");
                return default(TItem);
            }
        }


        private async Task SaveToCacheAsync(RedisKey cacheKey, object obj, string hashField, DateTime expiration)
        {
            try
            {
                var dataToSave = new CacheObject<object>
                {
                    Expiration = expiration,
                    Data = obj
                };

                string serialized = JsonConvert.SerializeObject(dataToSave, Formatting.None, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });

                await _cache.HashSetAsync(cacheKey, hashField, serialized);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error with saving item with key \"{hashField}\" to cache.");
            }
        }

        private (RedisKey, string) FormatKey(string key, params object[] identifiers)
        {
            var hashKey = (RedisKey) $"{_settings.CacheName}{key}";
            var cacheKey = new StringBuilder();

            if (identifiers != null)
            {
                foreach (object identifier in identifiers)
                {
                    string id = identifier?.ToString();
                    if (!string.IsNullOrWhiteSpace(id))
                    {
                        if (cacheKey.Length != 0)
                        {
                            cacheKey.Append(":");
                        }

                        cacheKey.AppendFormat("{0}", id);
                    }
                }
            }

            if (cacheKey.Length == 0)
            {
                cacheKey.Append(key);
            }

            return (hashKey, cacheKey.ToString());
        }

        #endregion private
    }
}