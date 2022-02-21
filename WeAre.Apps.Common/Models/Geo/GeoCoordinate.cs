using WeAre.Apps.Common.Interfaces.Geo;

namespace WeAre.Apps.Common.Models.Geo
{
    public class GeoCoordinate : IGeoCoordinate
    {
        /// <summary>
        /// "Latitude"
        /// </summary>
        public decimal Lat { get; set; }

        /// <summary>
        /// "Longitude"
        /// </summary>
        public decimal Lon { get; set; }
    }
}