using Microsoft.Extensions.Options;

namespace WeAre.Athenaeum.Services.Cache.Models
{
    public sealed class RedisSettings : IOptions<RedisSettings>
    {
        RedisSettings IOptions<RedisSettings>.Value => this;

        public string Host { get; set; }

        public int Port { get; set; }
        
        public string InstanceName { get; set; }

        public string Url => $"{Host}:{Port}";

        public string CacheName => $"{InstanceName}:Cache:";

        public string SessionName => $"{InstanceName}:Session:";

        public string DataProtectionKeysName => $"{InstanceName}:DataProtectionKeys:";
    }
}