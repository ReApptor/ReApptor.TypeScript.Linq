using Microsoft.Extensions.Options;
using WeAre.Athenaeum.Common.Api;

namespace WeAre.Athenaeum.Services.ACM.Models.OnePassword
{
    public class OnePasswordCredentialServiceSettings : IOptions<OnePasswordCredentialServiceSettings>, IApiSettings
    {
        OnePasswordCredentialServiceSettings IOptions<OnePasswordCredentialServiceSettings>.Value => this;

        public string AccessToken { get; set; }

        public string ApiUrl { get; set; }

        public int TimeoutInSeconds { get; set; }
    }
}