using System;
using System.Text;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Renta.Apps.Common.Configuration.Settings;
using WeAre.Athenaeum.Common.Configuration;
using WeAre.Athenaeum.Common.Configuration.Settings;
using WeAre.Athenaeum.Common.Interfaces.ACM;
using WeAre.Athenaeum.Services.ACM.Implementation;
using WeAre.Athenaeum.Services.Cache.Models;

namespace Renta.TestApplication.Common.Configuration
{
    public sealed class TestApplicationConfiguration : BaseEnvironmentConfiguration<TestApplicationConfiguration>
    {
        private int? _coresPerServer;
        private int? _sessionTimeoutMinutes;
        private int? _emailTokenTimeoutInMinutes;
        private bool? _syncEnabled;
        private string _apiUrl;
        private string _applicationUrl;
        private string _backendInstanceName;
        private string _frontendInstanceName;
        private string _dataProtectionKey;
        private OnePasswordCredentialServiceSettings _acmSettings;
        private GoogleSettings _googleSettings;
        private SymmetricSecurityKey _tokenSecurityKey;
        private RedisSettings _redisSettings;
        private TokenSettings _tokenSettings;

        public TestApplicationConfiguration(IHostEnvironment environment, ILogger<TestApplicationConfiguration> logger, ICredentialService credentialService = null)
            : base(environment, logger, credentialService)
        {
        }

        public int CoresPerServer
        {
            get { return (_coresPerServer ??= _coresPerServer = GetIntEnvironmentVariable("CORES_PER_SERVER", 2)).Value; }
        }

        public int SessionTimeoutMinutes
        {
            get { return (_sessionTimeoutMinutes ??= _sessionTimeoutMinutes = GetIntEnvironmentVariable("SESSION_TIMEOUT_MINUTES", 20)).Value; }
        }

        /// <summary>
        /// Email token timeout for OrderEmail, 7 days by default
        /// </summary>
        public int EmailTokenTimeoutInMinutes
        {
            get { return (_emailTokenTimeoutInMinutes ??= GetIntEnvironmentVariable("EMAIL_TOKEN_TIMEOUT_MINUTES", 7 * 24 * 60)); }
        }

        public SymmetricSecurityKey TokenSecurityKey
        {
            get
            {
                if (_tokenSecurityKey == null)
                {
                    string value = GetEnvironmentVariable("TOKEN_SECURITY_KEY", "***REMOVED***");
                    _tokenSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(value));
                }
                return _tokenSecurityKey;
            }
        }

        public string FrontendInstanceName
        {
            get { return _frontendInstanceName ??= GetEnvironmentVariable("FRONTEND_INSTANCE_NAME"); }
        }

        public string BackendInstanceName
        {
            get { return _backendInstanceName ??= GetEnvironmentVariable("BACKEND_INSTANCE_NAME"); }
        }

        public string ApplicationUrl
        {
            get { return _applicationUrl ??= GetEnvironmentVariable("APPLICATION_URL"); }
        }
        
        public string ApiUrl
        {
            get { return _apiUrl ??= GetEnvironmentVariable("API_URL"); }
        }

        public OnePasswordCredentialServiceSettings AcmSettings
        {
            get
            {
                return _acmSettings ??= new OnePasswordCredentialServiceSettings
                {
                    ApiUrl = GetEnvironmentVariable("ACM_API", IsCloudEnvironment),
                    AccessToken = GetEnvironmentVariable("ACM_TOKEN", IsCloudEnvironment),
                    Path = GetEnvironmentVariable("ACM_PATH", IsCloudEnvironment),
                };
            }
        }

        public string DataProtectionKey
        {
            get { return _dataProtectionKey ??= GetEnvironmentVariable("DATA_PROTECTION_KEY"); }
        }

        public bool SyncEnabled
        {
            get { return _syncEnabled ??= GetBoolEnvironmentVariable("SYNC_ENABLED", false); }
        }

        public GoogleSettings GoogleSettings
        {
            get
            {
                return _googleSettings ??= new GoogleSettings()
                {
                    MapApiBeKey = GetEnvironmentVariable("GOOGLE_MAP_API_BE_KEY"),
                    MapApiFeKey = GetEnvironmentVariable("GOOGLE_MAP_API_FE_KEY"),
                    MapApiUrl = GetEnvironmentVariable("GOOGLE_MAP_API_URL", @"https://maps.googleapis.com/maps/"),
                    RequestsPer100Sec = GetIntEnvironmentVariable("GOOGLE_MAP_API_REQUESTS_PER_100_SEC", 1000)
                };
            }
        }

        public RedisSettings RedisSettings
        {
            get
            {
                return _redisSettings ??= new RedisSettings
                {
                    Host = GetEnvironmentVariable("REDIS_URL"),
                    Port = GetIntEnvironmentVariable("REDIS_PORT"),
                    InstanceName = GetEnvironmentVariable("BACKEND_INSTANCE_NAME")
                };
            }
        }

        public TokenSettings TokenSettings
        {
            get
            {
                return _tokenSettings ??= new TokenSettings
                {
                    ServiceTokenTimeoutInMinutes = GetIntEnvironmentVariable("SERVICE_TOKEN_TIMEOUT_MINUTES", TimeSpan.FromDays(31).Minutes),
                    EmailTokenTimeoutInMinutes = GetIntEnvironmentVariable("EMAIL_TOKEN_TIMEOUT_MINUTES", TimeSpan.FromDays(7).Minutes),
                    MobileTokenTimeoutInMinutes = GetIntEnvironmentVariable("MOBILE_TOKEN_TIMEOUT_MINUTES", TimeSpan.FromDays(365).Minutes),
                    SecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetEnvironmentVariable("TOKEN_SECURITY_KEY"))),
                    Issuer = GetEnvironmentVariable("TOKEN_ISSUER")
                };
            }
        }

        public bool UseHsts
        {
            get { return (!IsDevelopmentVS); }
        }
    }
}