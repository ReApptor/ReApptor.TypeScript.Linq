using Microsoft.Extensions.Options;

namespace WeAre.Athenaeum.Services.ACM.Implementation
{
    public class OnePasswordCredentialServiceSettings : IOptions<OnePasswordCredentialServiceSettings>
    {
        OnePasswordCredentialServiceSettings IOptions<OnePasswordCredentialServiceSettings>.Value => this;

        public string AccessToken { get; set; }

        public string ApiUrl { get; set; }

        public int TimeoutInSeconds { get; set; }
    }
}