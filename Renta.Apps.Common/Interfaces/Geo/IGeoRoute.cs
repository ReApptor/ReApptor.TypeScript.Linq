namespace Renta.Apps.Common.Interfaces.Geo
{
    public interface IGeoRoute
    {
        IGeoCoordinate From { get; set; }
        
        IGeoCoordinate To { get; set; }
    }
}