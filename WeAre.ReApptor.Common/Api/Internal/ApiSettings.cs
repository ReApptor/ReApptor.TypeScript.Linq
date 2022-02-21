namespace WeAre.ReApptor.Common.Api.Internal
{
    internal sealed class ApiSettings : IBasicApiSettings
    {
        public string ApiUrl { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string BasicToken { get; set; }

        public string BearerToken { get; set; }

        public string ApiKey { get; set; }

        public string ApiKeyHeaderName { get; set; }

        public string ApiKeyParamName { get; set; }

        public int TimeoutInSeconds { get; set; }

        public ApiSettings(string apiUrl, int timeoutInSeconds = 0)
        {
            ApiUrl = apiUrl;
            TimeoutInSeconds = timeoutInSeconds;
        }

        public ApiSettings(string apiUrl, string username, string password, int timeoutInSeconds = 0)
        {
            ApiUrl = apiUrl;
            Username = username;
            Password = password;
            TimeoutInSeconds = timeoutInSeconds;
        }
    }
}