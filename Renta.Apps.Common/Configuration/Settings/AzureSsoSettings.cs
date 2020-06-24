﻿using Microsoft.Extensions.Options;

 namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class AzureSsoSettings : IOptions<AzureSsoSettings>
    {
        AzureSsoSettings IOptions<AzureSsoSettings>.Value => this;

        public string ApplicationId { get; set; }

        public string ClientSecret { get; set; }
    }
}