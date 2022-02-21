using WeAre.ReApptor.Common.Api;

namespace WeAre.ReApptor.Services.ACM.Implementation.API.OnePassword
{
    public sealed class OnePasswordApiSettings : IApiSettings
    {
        public string ApiUrl { get; set; }
        
        public string AccessToken { get; set; }
        
        public int TimeoutInSeconds { get; set; }
    }
}