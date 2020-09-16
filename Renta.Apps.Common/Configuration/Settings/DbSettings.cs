using Microsoft.Extensions.Options;

 namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class DbSettings : IOptions<DbSettings>
    {
        DbSettings IOptions<DbSettings>.Value => this;

        public string ConnectionString { get; set; }
    }
}