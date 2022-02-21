using System;
using WeAre.ReApptor.Toolkit.Scheduling;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest.Scheduling
{
    public sealed class TimeZoneTests
    {
        [Fact]
        public void FinnishTimeZoneTest()
        {
            const string countryCode = "fi";
            TimeZoneInfo timeZoneInfo = ScheduleHelper.FetchCountryTimeZone(countryCode);
            var expected = new[] { "Europe/Helsinki", "FLE Standard Time" };
            Assert.Contains(timeZoneInfo.Id, expected);
        }
    }
}