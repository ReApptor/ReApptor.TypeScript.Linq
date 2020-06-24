namespace Renta.Apps.Common.Interfaces.Geo
{
    public interface IGeoCoordinate
    {
        /// <summary>
        /// "Latitude
        /// </summary>
        decimal Lat { get; set; }

        /// <summary>
        /// "Longitude
        /// </summary>
        decimal Lon { get; set; }
    }
}