using Microsoft.Extensions.Options;

 namespace WeAre.Apps.Common.Configuration.Settings
{
    public sealed class DbSettings : IOptions<DbSettings>
    {
        DbSettings IOptions<DbSettings>.Value => this;

        public string ConnectionString { get; set; }
        
        public int? CommandTimeoutInSeconds { get; set; }
    }
}