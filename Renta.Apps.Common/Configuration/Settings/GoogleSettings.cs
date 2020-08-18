using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class GoogleSettings : IOptions<GoogleSettings>
    {
        GoogleSettings IOptions<GoogleSettings>.Value => this;
        
        /// <summary>
        /// API key with restriction by IP
        /// </summary>
        public string MapApiBeKey { get; set; }
        
        /// <summary>
        /// API key with restriction by HTTP address
        /// </summary>
        public string MapApiFeKey { get; set; }

        public string MapApiUrl { get; set; }
        
        /// <summary>
        /// Requests per 100 seconds (requests' frequency limit)
        /// </summary>
        public int RequestsPer100Sec { get; set; }

        /// <summary>
        /// Min delay in mlsec between Google api requests (based on requests' frequency)
        /// </summary>
        public int RequestsDelay => (RequestsPer100Sec > 0) ? (100 + 100000 / RequestsPer100Sec) : 0;
    }
}