using Microsoft.Extensions.Options;

 namespace WeAre.Apps.Common.Configuration.Settings
{
    public sealed class GoogleSsoSettings : BaseSsoSettings, IOptions<GoogleSsoSettings>
    {
        GoogleSsoSettings IOptions<GoogleSsoSettings>.Value => this;

        public string ClientId { get; set; }

        public string ClientSecret { get; set; }
    }
}