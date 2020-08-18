using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class RedisSettings : IOptions<RedisSettings>
    {
        RedisSettings IOptions<RedisSettings>.Value => this;

        public string Host { get; set; }

        public int Port { get; set; }
        
        public string InstanceName { get; set; }

        public string Url
        {
            get { return $"{Host}:{Port}"; }
        }

        public string CacheName
        {
            get { return  $"{InstanceName}:Cache:"; }
        }

        public string SessionName
        {
            get { return  $"{InstanceName}:Session:"; }
        }

        public string DataProtectionKeysName
        {
            get { return  $"{InstanceName}:DataProtectionKeys:"; }
        }
    }
}