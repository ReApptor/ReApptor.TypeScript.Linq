using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class FileStorageSettings : IOptions<FileStorageSettings>
    {
        FileStorageSettings IOptions<FileStorageSettings>.Value => this;

        public string BucketName { get; set; }
        
        public string EasyBucketName { get; set; }
    }
}