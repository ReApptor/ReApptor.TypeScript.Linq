namespace Renta.Apps.Common.Interfaces.Geo
{
    public interface IGeoAddress
    {
        string Country { get; set; }

        string Address { get; set; }

        string City { get; set; }

        string PostalCode { get; set; }

        string PostalBox { get; set; }
    }
}