using System;
using System.Threading.Tasks;
using WeAre.Athenaeum.Services.Cache.Models;

namespace WeAre.Athenaeum.Services.Cache.Interface
{
    public interface ICacheService
    {
        Task<T> GetAsync<T>(string key, params object [] identifier);
        
        Task SaveAsync(string key, object obj,  params object [] identifiers);

        Task SaveAsync(string key, object obj, TimeSpan? cacheDuration, params object [] identifiers);

        Task InvalidateCacheAsync(string[] cacheKeys, params object[] identifier);

        Task ClearFolder(params string[] cacheKeys);

        Task ClearAll();

        Task ClearEntry(string cacheKey, Guid entityId);
    }
}