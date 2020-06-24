using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class ReportingApiSettings : DataReportingSettings, IOptions<ReportingApiSettings>
    {
        ReportingApiSettings IOptions<ReportingApiSettings>.Value => this;
        
        public string EndpointUrl { get; set; }
        
        public string ApiKey { get; set; }
    }
}