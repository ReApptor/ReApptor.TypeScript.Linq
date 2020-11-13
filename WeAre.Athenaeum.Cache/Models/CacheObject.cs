using System;

namespace WeAre.Athenaeum.Cache.Models
{
    public class CacheObject<T>
    {
        public DateTime Expiration { get; set; }

        public T Data { get; set; }
    }
}