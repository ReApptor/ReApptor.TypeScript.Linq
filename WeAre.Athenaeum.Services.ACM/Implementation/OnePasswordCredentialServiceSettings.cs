using Microsoft.Extensions.Options;
using WeAre.Athenaeum.Common.Interfaces.ACM;

namespace WeAre.Athenaeum.Services.ACM.Implementation
{
    public class OnePasswordCredentialServiceSettings : ICredentialServiceSettings<OnePasswordCredentialServiceSettings>
    {
        OnePasswordCredentialServiceSettings IOptions<OnePasswordCredentialServiceSettings>.Value => this;

        public string AccessToken { get; set; }

        public string ApiUrl { get; set; }

        public int TimeoutInSeconds { get; set; }
    }
}