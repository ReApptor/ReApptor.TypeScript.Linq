using System;
using WeAre.Athenaeum.Cache.Interface;

namespace WeAre.Athenaeum.Cache.Models
{
    public class CacheKey 
    {
        public CacheKey(string key)
        {
            Key = key;
        }

        public string Key { get; private set; }

        public override string ToString()
        {
            return Key;
        }
    }
}