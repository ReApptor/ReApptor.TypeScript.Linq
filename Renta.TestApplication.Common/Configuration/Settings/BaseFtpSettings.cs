
namespace WeAre.Athenaeum.TemplateApp.Common.Configuration.Settings
{
    public abstract class BaseFtpSettings : IFtpSettings
    {
        public string Url { get; set; }
        
        public string Username { get; set; }

        public string FileNamePrefix { get; set; }

        public string Password { get; set; }
        
        public string Path { get; set; }

        public int TimeoutInSec { get; set; }
    }
}