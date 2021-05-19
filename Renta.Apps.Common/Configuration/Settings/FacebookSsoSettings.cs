using Microsoft.Extensions.Options;

 namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class FacebookSsoSettings : BaseSsoSettings, IOptions<FacebookSsoSettings>
    {
        FacebookSsoSettings IOptions<FacebookSsoSettings>.Value => this;

        public string AppId { get; set; }

        public string AppSecret { get; set; }
    }
}