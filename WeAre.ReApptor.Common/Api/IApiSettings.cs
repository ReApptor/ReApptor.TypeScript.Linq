namespace WeAre.ReApptor.Common.Api
{
    public interface IApiSettings
    {
        public string ApiUrl { get; }

        public int TimeoutInSeconds { get; }
    }
}