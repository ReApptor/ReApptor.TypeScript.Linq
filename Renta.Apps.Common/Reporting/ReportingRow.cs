using System;

namespace Renta.Tools.Api.Common.Models.Reporting
{
    public sealed class ReportingRow
    {
        public string Key { get; set; }

        public DateTime? CreateAt { get; set; }

        public DateTime? ModifiedAt { get; set; }
        
        //public string Entity { get; set; }
        public object Entity { get; set; }
    }
}