using Renta.Tools.Common;

namespace Renta.Tools.Api.Common.Models.Reporting.Requests
{
    public sealed class GetLastTimestampRequest
    {
        public string Table { get; set; }

        public AuditTimestamp AuditTimestamp { get; set; }
    }
}