using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class AwsSettings : IOptions<AwsSettings>
    {
        AwsSettings IOptions<AwsSettings>.Value => this;

        public string Profile { get; set; }

        public string Region { get; set; }
    }
}