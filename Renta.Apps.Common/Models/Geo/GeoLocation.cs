using Renta.Apps.Common.Helpers;
using Renta.Apps.Common.Interfaces.Geo;

namespace Renta.Apps.Common.Models.Geo
{
    public sealed class GeoLocation : GeoCoordinate, IGeoLocation
    {
        public string Country { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string PostalCode { get; set; }

        public string PostalBox { get; set; }

        public string FormattedAddress => this.GetFormattedAddress(true);

        public int HashCode => FormattedAddress.ToLowerInvariant().GetHashCode();

        public bool IsGeoLocation => true;
    }
}