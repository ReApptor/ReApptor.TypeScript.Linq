using System;
using WeAre.Athenaeum.Toolkit.Attributes;
using Xunit;

namespace WeAre.Athenaeum.Toolkit.UnitTest
{
    public sealed class DateOnlyAttributeTests
    {
        public const int WinterTimezoneOffset = 120;
        public const int SummerTimezoneOffset = 180;
        public static readonly TimeZoneInfo DefaultTimeZone = Utility.GetTimeZone("Europe/Helsinki", "FLE Standard Time");
        public static readonly int TodayTimezoneOffset = (DefaultTimeZone.IsDaylightSavingTime(DateTime.Now)) ? SummerTimezoneOffset : WinterTimezoneOffset;
        
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
            var date = new DateTime();
            var expectedDate = Utility.ToLocal(date, DefaultTimeZone, TodayTimezoneOffset);
            
            var request = new Request
            {
                Items = new[]
                {
                    new Item { Date = date },
                    new Item { Date = date }
                },
                Dates = new[]
                {
                    date,
                    date
                }
            };

            request = Utility.ToLocal(request, DefaultTimeZone, TodayTimezoneOffset) as Request;
            
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

        [Fact]
        public void WinterWinterTest()
        {
            var now = new DateTime(2021, 01, 01, 12, 00, 00, DateTimeKind.Local);
            var input = new DateTime(2021, 01, 31, 22, 00, 00, DateTimeKind.Utc);
            var result = new DateTime(2021, 02, 01, 00, 00, 00, DateTimeKind.Utc);

            DateTime local = Utility.ToLocal(now, input, DefaultTimeZone, WinterTimezoneOffset);
            
            Assert.Equal(result, local);
        }

        [Fact]
        public void SummerWinterTest()
        {
            var nowSummer = new DateTime(2021, 04, 01, 12, 00, 00, DateTimeKind.Local);
            var inputWinter = new DateTime(2021, 01, 31, 22, 00, 00, DateTimeKind.Utc);
            var result = new DateTime(2021, 02, 01, 00, 00, 00, DateTimeKind.Utc);

            DateTime local = Utility.ToLocal(nowSummer, inputWinter, DefaultTimeZone, SummerTimezoneOffset);
            
            Assert.Equal(result, local);
        }

        [Fact]
        public void WinterSummerTest()
        {
            var nowWinter = new DateTime(2021, 01, 01, 12, 00, 00, DateTimeKind.Local);
            var inputSummer = new DateTime(2021, 03, 31, 21, 00, 00, DateTimeKind.Utc);
            var result = new DateTime(2021, 04, 01, 00, 00, 00, DateTimeKind.Utc);

            DateTime local = Utility.ToLocal(nowWinter, inputSummer, DefaultTimeZone, WinterTimezoneOffset);
            
            Assert.Equal(result, local);
        }

        [Fact]
        public void SummerSummerTest()
        {
            var nowSummer = new DateTime(2021, 04, 01, 12, 00, 00, DateTimeKind.Local);
            var inputSummer = new DateTime(2021, 03, 31, 21, 00, 00, DateTimeKind.Utc);
            var result = new DateTime(2021, 04, 01, 00, 00, 00, DateTimeKind.Utc);

            DateTime local = Utility.ToLocal(nowSummer, inputSummer, DefaultTimeZone, SummerTimezoneOffset);
            
            Assert.Equal(result, local);
        }
    }
}