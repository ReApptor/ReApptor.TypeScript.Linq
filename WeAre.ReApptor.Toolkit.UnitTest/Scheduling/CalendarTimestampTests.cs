using System;
using WeAre.ReApptor.Toolkit.Scheduling;
using WeAre.ReApptor.Toolkit.Scheduling.Entities;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest.Scheduling
{
    public sealed class CalendarTimestampTests
    {
        [Fact]
        public void DayOnlyCompareTest()
        {
            var x = new CalendarTimestamp(25, null, null);

            int gt = x.CompareTo(new DateTime(2015, 1, 24));
            int eq = x.CompareTo(new DateTime(2015, 1, 25));
            int lt = x.CompareTo(new DateTime(2015, 1, 26));

            Assert.Equal(1, gt);
            Assert.Equal(0, eq);
            Assert.Equal(-1, lt);
        }

        [Fact]
        public void MonthOnlyCompareTest()
        {
            var x = new CalendarTimestamp(null, MonthOfYear.July, null);

            int gt = x.CompareTo(new DateTime(2015, 06, 24));
            int eq = x.CompareTo(new DateTime(2015, 07, 25));
            int lt = x.CompareTo(new DateTime(2015, 08, 26));

            Assert.Equal(1, gt);
            Assert.Equal(0, eq);
            Assert.Equal(-1, lt);

            eq = x.CompareTo(new DateTime(2015, 07, 24));

            Assert.Equal(0, eq);

            eq = x.CompareTo(new DateTime(2015, 07, 26));

            Assert.Equal(0, eq);
        }

        [Fact]
        public void YearOnlyCompareTest()
        {
            var x = new CalendarTimestamp(null, null, 2015);

            int gt = x.CompareTo(new DateTime(2014, 06, 24));
            int eq = x.CompareTo(new DateTime(2015, 07, 25));
            int lt = x.CompareTo(new DateTime(2016, 08, 26));

            Assert.Equal(1, gt);
            Assert.Equal(0, eq);
            Assert.Equal(-1, lt);

            eq = x.CompareTo(new DateTime(2015, 07, 24));

            Assert.Equal(0, eq);

            eq = x.CompareTo(new DateTime(2015, 07, 26));

            Assert.Equal(0, eq);
        }

        [Fact]
        public void DayAndMonthCompareTest()
        {
            var x = new CalendarTimestamp(25, MonthOfYear.July, null);

            int gt = x.CompareTo(new DateTime(2015, 07, 24));
            int eq = x.CompareTo(new DateTime(2015, 07, 25));
            int lt = x.CompareTo(new DateTime(2015, 07, 26));

            Assert.Equal(1, gt);
            Assert.Equal(0, eq);
            Assert.Equal(-1, lt);

            gt = x.CompareTo(new DateTime(2015, 06, 26));
            lt = x.CompareTo(new DateTime(2015, 08, 24));

            Assert.Equal(1, gt);
            Assert.Equal(-1, lt);
        }

        [Fact]
        public void MonthAndYearCompareTest()
        {
            var x = new CalendarTimestamp(null, MonthOfYear.July, 2015);

            int gt = x.CompareTo(new DateTime(2015, 06, 24));
            int eq = x.CompareTo(new DateTime(2015, 07, 25));
            int lt = x.CompareTo(new DateTime(2015, 08, 26));

            Assert.Equal(1, gt);
            Assert.Equal(0, eq);
            Assert.Equal(-1, lt);

            gt = x.CompareTo(new DateTime(2014, 08, 26));
            lt = x.CompareTo(new DateTime(2016, 06, 24));

            Assert.Equal(1, gt);
            Assert.Equal(-1, lt);
        }
    }
}