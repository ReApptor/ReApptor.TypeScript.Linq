﻿using Microsoft.Extensions.Options;

namespace WeAre.Apps.Common.Configuration.Settings
{
    public class DataReportingSettings : IOptions<DataReportingSettings>
    {
        DataReportingSettings IOptions<DataReportingSettings>.Value => this;

        public bool Enabled { get; set; }
        
        public int PageSize { get; set; }
    }
}