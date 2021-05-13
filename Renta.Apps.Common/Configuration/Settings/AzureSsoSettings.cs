using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

 namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class AzureSsoSettings : IOptions<AzureSsoSettings>
    {
        AzureSsoSettings IOptions<AzureSsoSettings>.Value => this;

        public string ApplicationId { get; set; }

        public string ClientSecret { get; set; }

        public CookieSecurePolicy SecurePolicy { get; set; } = CookieSecurePolicy.Always;

        public SameSiteMode SameSite { get; set; } = SameSiteMode.Lax;

        public int ExpirationTimeoutInSec { get; set; } = 600;
    }
}