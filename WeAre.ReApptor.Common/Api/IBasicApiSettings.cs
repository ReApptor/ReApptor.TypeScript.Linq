namespace WeAre.ReApptor.Common.Api
{
    /// <summary>
    /// Api provider with "Basic" (Username & Password) authorization
    /// </summary>
    public interface IBasicApiSettings : IApiSettings
    {
        public string Username { get; set; }
        
        public string Password { get; set; }
    }
}