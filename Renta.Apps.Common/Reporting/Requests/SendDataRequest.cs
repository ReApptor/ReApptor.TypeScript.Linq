namespace Renta.Tools.Api.Common.Models.Reporting.Requests
{
    public sealed class SendDataRequest
    {
        public string Table { get; set; }

        public ReportingRow[] Rows { get; set; }
    }
}