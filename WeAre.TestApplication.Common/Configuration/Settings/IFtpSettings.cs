namespace WeAre.TestApplication.Common.Configuration.Settings
{
    public interface IFtpSettings
    {
        string Url { get; set; }
        
        string Username { get; set; }
        
        string FileNamePrefix { get; set; }
        
        string Password { get; set; }
        
        string Path { get; set; }

        int TimeoutInSec { get; set; }
    }
}