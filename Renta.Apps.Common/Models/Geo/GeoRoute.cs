using Renta.Apps.Common.Interfaces.Geo;

namespace Renta.Apps.Common.Models.Geo
{
    public sealed class GeoRoute : IGeoRoute
    {
        public IGeoCoordinate From { get; set; }
        
        public IGeoCoordinate To { get; set; }
    }
}