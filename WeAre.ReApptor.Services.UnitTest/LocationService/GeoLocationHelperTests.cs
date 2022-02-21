using WeAre.Apps.Common.Helpers;
using WeAre.Apps.Common.Interfaces.Geo;
using Xunit;

namespace WeAre.ReApptor.Services.UnitTest.LocationService
{
    public sealed class GeoLocationHelperTests
    {
        [Fact]
        public void ParseFormattedAddressTest1()
        {
            //Address comes in formats:
            //  "Äyritie 12, 01510 Vantaa, Finland, #60.21083359999999, 24.951597"
            //  "Äyritie 12, Vantaa, Finland, #60.21083359999999, 24.951597"
            //  "Äyritie 12, Vantaa, 01510, Finland, #60.21083359999999, 24.951597"
            string[] formattedAddresses = {
                "Äyritie 12, 01510 Vantaa, Finland, #60.21083359999999, 24.951597",
                "Äyritie 12, Vantaa, 01510, Finland, #60.21083359999999, 24.951597",
                "Äyritie 12, 01510 Vantaa, Suomi, #60.21083359999999, 24.951597",
                "Äyritie 12, Vantaa, 01510, Suomi, #60.21083359999999, 24.951597"
            };

            foreach (string formattedAddress in formattedAddresses)
            {
                IGeoLocation location = GeoLocationHelper.ReadFormattedAddress(formattedAddress);
                
                Assert.NotNull(location);
                Assert.Equal("Äyritie 12", location.Address);
                Assert.Equal("01510", location.PostalCode);
                Assert.Equal("Vantaa", location.City);
                Assert.Equal("Suomi", location.Country);
                Assert.Equal(60.21083359999999m, location.Lat);
                Assert.Equal(24.951597m, location.Lon);
            }
        }
        
        [Fact]
        public void ParseFormattedAddressTest2()
        {
            string[] formattedAddresses = {
                "Koskelantie, Helsinki, Finland, #60.21083359999999, 24.951597",
                "Koskelantie, Helsinki, Suomi, #60.21083359999999, 24.951597",
            };

            foreach (string formattedAddress in formattedAddresses)
            {
                IGeoLocation location = GeoLocationHelper.ReadFormattedAddress(formattedAddress);
                
                Assert.NotNull(location);
                Assert.Equal("Koskelantie", location.Address);
                Assert.Null(location.PostalCode);
                Assert.Equal("Helsinki", location.City);
                Assert.Equal("Suomi", location.Country);
                Assert.Equal(60.21083359999999m, location.Lat);
                Assert.Equal(24.951597m, location.Lon);
            }
        }
    }
}