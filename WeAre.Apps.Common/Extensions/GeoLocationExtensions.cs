using System;
using System.Collections.Generic;
using System.Linq;
using WeAre.Apps.Common.Interfaces.Geo;

namespace WeAre.Apps.Common.Extensions
{
    public static class GeoLocationExtensions
    {
        #region Distance

        public static double Distance(this IGeoCoordinate x, double lat, double lon)
        {
            if (x == null)
                throw new ArgumentNullException(nameof(x));

            //return (decimal)Math.Sqrt((double)(x.Lat * lat + x.Lon * lon));

            // The math module contains a function
            // named toRadians which converts from
            // degrees to radians.

            double delta = Math.PI / 180;

            double lon1 = (double)x.Lon * delta;
            double lon2 = lon * delta;
            double lat1 = (double)x.Lat * delta;
            double lat2 = lat * delta;

            // Haversine formula
            double dLon = lon2 - lon1;
            double dLat = lat2 - lat1;
            double a = Math.Pow(Math.Sin(dLat / 2), 2) + Math.Cos(lat1) * Math.Cos(lat2) * Math.Pow(Math.Sin(dLon / 2), 2);

            double c = 2 * Math.Asin(Math.Sqrt(a));

            // Radius of earth in kilometers. Use 3956 for miles
            const double r = 6371;

            // calculate the result
            return (c * r);
        }

        public static double Distance(this IGeoCoordinate x, decimal lat, decimal lon)
        {
            return Distance(x, (double)lat, (double)lon);
        }

        public static double Distance(this IGeoCoordinate x, IGeoCoordinate y)
        {
            if (x == null)
                throw new ArgumentNullException(nameof(x));
            if (y == null)
                throw new ArgumentNullException(nameof(y));

            return x.Distance(y.Lat, y.Lon);
        }

        public static double Distance(this IEnumerable<IGeoCoordinate> coordinates)
        {
            IGeoCoordinate[] items = (coordinates ?? Array.Empty<IGeoCoordinate>())
                .Where(item => item != null)
                .ToArray();

            double distance = 0;

            for (int i = 0; i < items.Length - 1; i++)
            {
                distance += Distance(items[i], items[i + 1]);
            }

            return distance;
        }

        #endregion

        #region IsCompleted

        public static bool IsCompleted(this IGeoLocation location)
        {
            return (location != null) &&
                   (!string.IsNullOrWhiteSpace(location.Address)) &&
                   (!string.IsNullOrWhiteSpace(location.Country)) &&
                   (location.Lat > 0) &&
                   (location.Lon > 0);
        }

        public static bool IsCompleted(this IGeoAddress address)
        {
            return (address != null) &&
                   (!string.IsNullOrWhiteSpace(address.Address)) &&
                   (!string.IsNullOrWhiteSpace(address.Country)) &&
                   (address is IGeoCoordinate coordinate) &&
                   (coordinate.Lat > 0) &&
                   (coordinate.Lon > 0);
        }

        public static bool IsCompleted(this IGeoCoordinate coordinate)
        {
            return (coordinate != null) &&
                   (coordinate.Lat > 0) &&
                   (coordinate.Lon > 0) &&
                   (coordinate is IGeoAddress address) &&
                   (!string.IsNullOrWhiteSpace(address.Address)) &&
                   (!string.IsNullOrWhiteSpace(address.Country));
        }

        #endregion
    }
}