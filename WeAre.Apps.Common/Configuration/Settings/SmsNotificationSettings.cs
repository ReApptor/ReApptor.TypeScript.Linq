using Microsoft.Extensions.Options;

namespace WeAre.Apps.Common.Configuration.Settings
{
    public class SmsNotificationSettings : IOptions<SmsNotificationSettings>
    {
        SmsNotificationSettings IOptions<SmsNotificationSettings>.Value => this;

        public string User { get; set; }

        public string Password { get; set; }

        public string Url { get; set; }
        
        public string WhiteListedNumbers { get; set; }

    }
}