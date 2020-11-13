using System;
using System.Threading.Tasks;
using WeAre.Athenaeum.Cache.Models;

namespace WeAre.Athenaeum.Cache.Interface
{
    public interface ICacheService
    {
        Task<T> GetAsync<T>(CacheKey key, params object [] identifier);
        
        Task SaveAsync(CacheKey key, object obj,  params object [] identifiers);

        Task SaveAsync(CacheKey key, object obj, TimeSpan? cacheDuration, params object [] identifiers);

        Task InvalidateCacheAsync(CacheKey[] cacheKeys, params object[] identifier);

        Task ClearFolder(params CacheKey[] cacheKeys);

        Task ClearAll();

        Task ClearEntry(CacheKey cacheKey, Guid entityId);
    }
}