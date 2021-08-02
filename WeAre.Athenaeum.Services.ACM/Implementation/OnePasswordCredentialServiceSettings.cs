using Microsoft.Extensions.Options;
using WeAre.Athenaeum.Common.Interfaces.ACM;

namespace WeAre.Athenaeum.Services.ACM.Implementation
{
    public class OnePasswordCredentialServiceSettings : ICredentialServiceSettings, IOptions<OnePasswordCredentialServiceSettings>
    {
        OnePasswordCredentialServiceSettings IOptions<OnePasswordCredentialServiceSettings>.Value => this;

        public string ApiUrl { get; set; }

        public string AccessToken { get; set; }
        
        public string Path { get; set; }

        public int TimeoutInSeconds { get; set; }

        public string ToLogString()
        {
            string accessTokenPostfix = (!string.IsNullOrWhiteSpace(AccessToken) && AccessToken.Length > 4) 
                ? AccessToken.Substring(0, AccessToken.Length - 4) 
                : "";
            return $"ApiUrl=\"{ApiUrl}\". Path=\"{Path}\". TimeoutInSeconds=\"{TimeoutInSeconds}\". AccessToken=\"...{accessTokenPostfix}\".";
        }
    }
}