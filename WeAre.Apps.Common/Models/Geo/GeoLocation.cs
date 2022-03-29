using System;
using WeAre.Apps.Common.Helpers;
using WeAre.Apps.Common.Interfaces.Geo;

namespace WeAre.Apps.Common.Models.Geo
{
    public sealed class GeoLocation : GeoCoordinate, IGeoLocation
    {
        public GeoLocation()
        {
        }
        
        public GeoLocation(IGeoCoordinate from)
        {
            if (from == null)
                throw new ArgumentNullException(nameof(from));
            
            Lat = from.Lat;
            Lon = from.Lon;

            if (from is IGeoAddress geoAddress)
            {
                Country = geoAddress.Country;
                Address = geoAddress.Address;
                City = geoAddress.City;
                PostalCode = geoAddress.PostalCode;
                PostalBox = geoAddress.PostalBox;
            }
        }
        
        public GeoLocation(IGeoAddress from)
        {
            if (from == null)
                throw new ArgumentNullException(nameof(from));
            
            Country = from.Country;
            Address = from.Address;
            City = from.City;
            PostalCode = from.PostalCode;
            PostalBox = from.PostalBox;

            if (from is IGeoLocation geoLocation)
            {
                Lat = geoLocation.Lat;
                Lon = geoLocation.Lon;
            }
        }

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