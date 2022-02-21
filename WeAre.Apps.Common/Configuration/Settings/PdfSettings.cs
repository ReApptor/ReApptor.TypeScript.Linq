using Microsoft.Extensions.Options;

namespace WeAre.Apps.Common.Configuration.Settings
{
    public sealed class PdfSettings : IOptions<PdfSettings>
    {
        PdfSettings IOptions<PdfSettings>.Value => this;

        public string IronPdfLicenseKey { get; set; }

        public string PdfUrl { get; set; }
        
        #region Environment variable names

        /// <summary>
        /// "IRON_PDF_LICENSE_KEY"
        /// </summary>
        public const string IronPdfLicenseKeyVariableName = "IRON_PDF_LICENSE_KEY";

        /// <summary>
        /// "PDF_URL"
        /// </summary>
        public const string PdfUrlVariableName = "PDF_URL";
        
        #endregion
    }
}