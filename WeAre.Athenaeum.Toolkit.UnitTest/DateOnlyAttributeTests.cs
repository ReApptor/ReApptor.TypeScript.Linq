using System;
using WeAre.Athenaeum.Toolkit.Attributes;
using Xunit;

namespace WeAre.Athenaeum.Toolkit.UnitTest
{
    public sealed class DateOnlyAttributeTests
    {
        #region Declarations

        private sealed class Request
        {
            public Item[] Items { get; set; }
            
            [DateOnly]
            public DateTime[] Dates { get; set; }
        }

        private sealed class Item
        {
            [DateOnly]
            public DateTime Date { get; set; }
        }
        
        #endregion

        [Fact]
        public void RequestWithArrayTest()
        {
            const int timezoneOffset = 120;
            TimeZoneInfo defaultTimeZone = Utility.GetTimeZone("Europe/Helsinki", "FLE Standard Time");
            const string dateTimePattern = "yyyy-MM-dd hh:mm:ss";
            var date = new DateTime();
            var expectedDate = date.Date.AddMinutes(timezoneOffset);
            
            var request = new Request {Items = new[] { new Item { Date = date }, new Item { Date = date } }, Dates = new[] { date, date }};

            request = Utility.ToLocal(request, defaultTimeZone, timezoneOffset) as Request;
            
            Assert.NotNull(request);
            
            Assert.NotNull(request.Dates);
            Assert.Equal(2, request.Dates.Length);
            Assert.Equal(expectedDate, request.Dates[0]);
            Assert.Equal(expectedDate, request.Dates[1]);
            
            Assert.NotNull(request.Items);
            Assert.Equal(2, request.Items.Length);
            Assert.NotNull(request.Items[0]);
            Assert.NotNull(request.Items[1]);
            Assert.Equal(expectedDate, request.Items[0].Date);
            Assert.Equal(expectedDate, request.Items[1].Date);
        }
    }
}