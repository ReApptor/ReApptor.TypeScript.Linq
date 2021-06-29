using WeAre.Athenaeum.Common.Api;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword
{
    public sealed class OnePasswordApiSettings : IApiSettings
    {
        public string ApiUrl { get; set; }
        
        public string AccessToken { get; set; }
        
        public int TimeoutInSeconds { get; set; }
    }
}