using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class FileStorageSettings : IOptions<FileStorageSettings>
    {
        FileStorageSettings IOptions<FileStorageSettings>.Value => this;

        public string BucketName { get; set; }

        /// <summary>
        /// The directory name to store files on local (DEV) environment
        /// </summary>
        public string LocalDirectory { get; set; }
        
        public string EasyBucketName { get; set; }
    }
}