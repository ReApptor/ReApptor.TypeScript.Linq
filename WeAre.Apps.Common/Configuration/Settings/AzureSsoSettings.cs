using Microsoft.Extensions.Options;

namespace WeAre.Apps.Common.Configuration.Settings
{
    public sealed class AzureSsoSettings : BaseSsoSettings, IOptions<AzureSsoSettings>
    {
        AzureSsoSettings IOptions<AzureSsoSettings>.Value => this;

        public string ApplicationId { get; set; }

        public string ClientSecret { get; set; }
    }
}