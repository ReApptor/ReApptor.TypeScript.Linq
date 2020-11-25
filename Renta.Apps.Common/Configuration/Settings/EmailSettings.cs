using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class EmailSettings : IOptions<EmailSettings>
    {
        EmailSettings IOptions<EmailSettings>.Value => this;
        
        public string ApiUrl { get; set; }
        
        public string ApiKey { get; set; }

        public string EmailSender { get; set; }
        
        public string WhiteListedDomains { get; set; }
    }
}