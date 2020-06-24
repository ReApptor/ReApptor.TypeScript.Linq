using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class ConnectSettings : IOptions<ConnectSettings>
    {
        ConnectSettings IOptions<ConnectSettings>.Value => this;

        public string BaseApiUrl { get; set; }

        public string ApiKey { get; set; }
    }
}