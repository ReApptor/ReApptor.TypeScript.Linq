using Newtonsoft.Json;
using Renta.Apps.Common.Interfaces.Geo;

namespace Renta.Apps.Common.Models.Geo
{
    public class GeoCoordinate : IGeoCoordinate
    {
        /// <summary>
        /// "Latitude"
        /// </summary>
        [JsonProperty("Latitude")]
        public decimal Lat { get; set; }

        /// <summary>
        /// "Longitude"
        /// </summary>
        [JsonProperty("Longitude")]
        public decimal Lon { get; set; }
    }
}