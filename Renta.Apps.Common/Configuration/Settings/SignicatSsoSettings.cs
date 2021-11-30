using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public class SignicatSsoSettings : BaseSsoSettings, IOptions<SignicatSsoSettings>
    {
        SignicatSsoSettings IOptions<SignicatSsoSettings>.Value => this;
        
        public string Authority { get; set; }
        
        public string Jwk { get; set; }

        public string ClientId { get; set; }
        
        public string ClientSecret { get; set; }
        
        public string CallbackPath { get; set; }
        
        public string GraphicalProfile { get; set; }
        
        public string AcrValues { get; set; }
        
        public string[] Scopes { get; set; }

    }
}