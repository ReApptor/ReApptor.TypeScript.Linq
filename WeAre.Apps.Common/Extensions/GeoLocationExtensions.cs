using System;
using WeAre.Apps.Common.Interfaces.Geo;

namespace WeAre.Apps.Common.Extensions
{
    public static class GeoLocationExtensions
    {
        public static decimal Distance(this IGeoCoordinate x, decimal lat, decimal lon)
        {
            if (x == null)
                throw new ArgumentNullException(nameof(x));

            return (decimal)Math.Sqrt((double)(x.Lat * lat + x.Lon * lon));
        }

        public static decimal Distance(this IGeoCoordinate x, IGeoCoordinate y)
        {
            if (x == null)
                throw new ArgumentNullException(nameof(x));
            if (y == null)
                throw new ArgumentNullException(nameof(y));

            return x.Distance(y.Lat, y.Lon);
        }
    }
}