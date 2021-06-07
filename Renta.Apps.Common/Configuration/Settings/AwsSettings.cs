using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class AwsSettings : IOptions<AwsSettings>
    {
        AwsSettings IOptions<AwsSettings>.Value => this;

        public string Profile { get; set; }

        public string Region { get; set; }

        public string AwsPinpointAppId { get; set; }

        public string AwsPinpointOriginationNumber { get; set; }

        public string AwsPinpointSenderId { get; set; }
        
        public string AwsPinpointRoleArn { get; set; }
    }
}