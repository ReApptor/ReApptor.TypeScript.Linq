using WeAre.Apps.Common.Interfaces.Geo;

namespace WeAre.Apps.Common.Models.Geo
{
    public sealed class GeoRoute : IGeoRoute
    {
        public IGeoCoordinate From { get; set; }
        
        public IGeoCoordinate To { get; set; }
    }
}