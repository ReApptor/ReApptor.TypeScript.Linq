using System.Threading.Tasks;

namespace Renta.Apps.Common.Interfaces.Geo
{
    public interface IGeoLocationService
    {
        /// <summary>
        /// Returns distance between 2 points in meters
        /// </summary>
        Task<int> DistanceAsync(IGeoCoordinate startPoint, IGeoCoordinate endPoint);
        
        /// <summary>
        /// Returns distance between multiple routes
        /// </summary>
        Task<int> DistanceAsync(params IGeoRoute[] routes);

        /// <summary>
        /// Calculates shortest distance from starting point to multiple possible destinations.
        /// Returns shortest distance and its geo coordinate
        /// </summary>
        Task<(int, IGeoCoordinate)> ShortestDistanceFromAsync(IGeoCoordinate startPoint, IGeoCoordinate[] destinations);

        Task<IGeoLocation[]> FindAddressAsync(string address, bool @throw = false);
        
        Task<IGeoLocation> FindAddressAsync(IGeoAddress address, bool @throw = false);
        
        Task<IGeoLocation> FindAddressAsync(IGeoCoordinate coordinate, bool @throw = false);
    }
}