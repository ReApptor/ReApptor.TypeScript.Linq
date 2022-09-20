using System;
using WeAre.ReApptor.Common.Helpers;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest
{
    public class CountryHelperTests
    {
        [Fact]
        public void TimeZonesTest()
        {
            var testData = new[]
            {
                (Code: "fi", StandardName: "GMT+02:00", SupportsDaylightSavingTime: true),
                (Code: "de", StandardName: "GMT+01:00", SupportsDaylightSavingTime: true),
                (Code: "fr", StandardName: "GMT+01:00", SupportsDaylightSavingTime: true),
            };

            foreach (var item in testData)
            {
                TimeZoneInfo timeZone = item.Code.GetDefaultCountyTimeZone();

                Assert.NotNull(timeZone);
                Assert.Equal(item.StandardName, timeZone.StandardName);
                Assert.Equal(item.SupportsDaylightSavingTime, timeZone.SupportsDaylightSavingTime);
            }
        }
    }
}