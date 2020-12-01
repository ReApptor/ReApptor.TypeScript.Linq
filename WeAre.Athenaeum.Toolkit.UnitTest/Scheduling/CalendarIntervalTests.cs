using System;
using System.Linq;
using WeAre.Athenaeum.Toolkit.Scheduling;
using WeAre.Athenaeum.Toolkit.Scheduling.Entities;
using Xunit;

namespace WeAre.Athenaeum.Toolkit.UnitTest.Scheduling
{
    public sealed class CalendarIntervalTests
    {
        [Fact]
        public void FullIntervalMatchTest()
        {
            const string rule = @"25 February - 05 March 2015";
            var interval = new CalendarInterval(rule);

            DateTime[] dates =
            {
                new DateTime(2015, 02, 25), new DateTime(2015, 02, 26), new DateTime(2015, 02, 27), new DateTime(2015, 02, 28),
                new DateTime(2015, 03, 01), new DateTime(2015, 03, 02), new DateTime(2015, 03, 03), new DateTime(2015, 03, 04),
                new DateTime(2015, 03, 05)
            };

            var begin = new DateTime(2014, 01, 01);
            var end = new DateTime(2016, 12, 31);

            DateTime timestamp = begin;
            DateTime? firstOccurrence = null;
            while (timestamp <= end)
            {
                bool match = interval.Match(timestamp, firstOccurrence);
                if ((match) && (firstOccurrence == null))
                {
                    firstOccurrence = timestamp;
                }
                bool shouldMatch = (dates.Any(x => x == timestamp));
                //string matchValue = shouldMatch ? "MATCH" : "NOT MATCH";
                //string error = $"Date \"{timestamp}\" does not math to the rule \"{rule}\" (Expected - {matchValue}).";
                Assert.Equal(shouldMatch, match);
                timestamp = timestamp.AddDays(1);
            }
        }

        [Fact]
        public void DayMonthMatchTest()
        {
            const string rule = @"10 February - 15 February";
            var interval = new CalendarInterval(rule);

            DateTime[] dates =
            {
                new DateTime(2014, 02, 10), new DateTime(2014, 02, 11),
                new DateTime(2014, 02, 12), new DateTime(2014, 02, 13),
                new DateTime(2014, 02, 14), new DateTime(2014, 02, 15),
                new DateTime(2015, 02, 10), new DateTime(2015, 02, 11),
                new DateTime(2015, 02, 12), new DateTime(2015, 02, 13),
                new DateTime(2015, 02, 14), new DateTime(2015, 02, 15),
                new DateTime(2016, 02, 10), new DateTime(2016, 02, 11),
                new DateTime(2016, 02, 12), new DateTime(2016, 02, 13),
                new DateTime(2016, 02, 14), new DateTime(2016, 02, 15),
            };

            var begin = new DateTime(2014, 01, 01);
            var end = new DateTime(2016, 12, 31);

            DateTime timestamp = begin;
            DateTime? firstOccurrence = null;
            while (timestamp <= end)
            {
                bool match = interval.Match(timestamp, firstOccurrence);
                if ((match) && (firstOccurrence == null))
                {
                    firstOccurrence = timestamp;
                }
                bool shouldMatch = (dates.Any(x => x == timestamp));
                //string matchValue = shouldMatch ? "MATCH" : "NOT MATCH";
                //string error = $"Date \"{timestamp}\" does not math to the rule \"{rule}\" (Expected - {matchValue}).";
                Assert.Equal(shouldMatch, match);
                timestamp = timestamp.AddDays(1);
            }
        }

        [Fact]
        public void DayIntervalParseTest()
        {
            const string script = @"12-14 February";
            var interval = new CalendarInterval(script);

            Assert.NotNull(interval);
            Assert.Equal("12 February - 14 February", interval.ToString());
        }

        [Fact]
        public void DateIntervalGetNextOccurrenceTest()
        {
            const int monthAdd = 1;
            const int daysAdd = 1;
            const int weeksAdd = 5;
            const int yearsAdd = 2;

            string monthIntervalScript = $"Add {monthAdd} Months";
            string yearsIntervalScript = $"Add {yearsAdd} years";
            string weekIntervalScript = $"Add {weeksAdd} Weeks";
            string dayIntervalScript = $"Add {daysAdd} days";

            var utcNow = DateTime.UtcNow;
            var lastOccurrence31To30 = new DateTime(2015, 05, 31);
            var lastOccurrence = utcNow.AddDays(-2);

            var scheduler = Scheduler.Parse(monthIntervalScript);
            var nextOccurrence = lastOccurrence31To30;
            nextOccurrence = scheduler.GetNextDateIntervalOccurrence(lastOccurrence31To30, nextOccurrence);

            Assert.True(lastOccurrence31To30.AddMonths(monthAdd) == nextOccurrence);
            Assert.True(nextOccurrence.Day == 30);
            Assert.True(nextOccurrence.TimeOfDay == lastOccurrence31To30.TimeOfDay);

            scheduler = Scheduler.Parse(monthIntervalScript);
            nextOccurrence = lastOccurrence;
            while (nextOccurrence <= utcNow)
            {
                nextOccurrence = scheduler.GetNextDateIntervalOccurrence(utcNow, nextOccurrence);
            }

            if (utcNow > lastOccurrence.AddMonths(monthAdd))
            {
                Assert.True(utcNow.AddMonths(monthAdd) == nextOccurrence);
                Assert.True(utcNow.AddMonths(monthAdd).TimeOfDay == nextOccurrence.TimeOfDay);
            }
            else
            {
                Assert.True(lastOccurrence.AddMonths(monthAdd) == nextOccurrence);
                Assert.True(lastOccurrence.AddMonths(monthAdd).TimeOfDay == nextOccurrence.TimeOfDay);
            }

            scheduler = Scheduler.Parse(yearsIntervalScript);
            nextOccurrence = lastOccurrence;
            while (nextOccurrence <= utcNow)
            {
                nextOccurrence = scheduler.GetNextDateIntervalOccurrence(utcNow, nextOccurrence);
            }

            if (utcNow > lastOccurrence.AddYears(yearsAdd))
            {
                Assert.True(utcNow.AddYears(yearsAdd) == nextOccurrence);
                Assert.True(utcNow.AddYears(yearsAdd).TimeOfDay == nextOccurrence.TimeOfDay);
            }
            else
            {
                Assert.True(lastOccurrence.AddYears(yearsAdd) == nextOccurrence);
                Assert.True(lastOccurrence.AddYears(yearsAdd).TimeOfDay == nextOccurrence.TimeOfDay);
            }

            scheduler = Scheduler.Parse(dayIntervalScript);
            lastOccurrence = lastOccurrence.AddHours(4);
            nextOccurrence = lastOccurrence;
            while (nextOccurrence <= utcNow)
            {
                nextOccurrence = scheduler.GetNextDateIntervalOccurrence(lastOccurrence, nextOccurrence);
            }

            Assert.True(lastOccurrence.AddDays((utcNow.Date - lastOccurrence.Date).Days) == nextOccurrence);
            Assert.True(lastOccurrence.TimeOfDay == nextOccurrence.TimeOfDay);
            
            scheduler = Scheduler.Parse(weekIntervalScript);
            lastOccurrence = lastOccurrence.AddHours(6);
            nextOccurrence = lastOccurrence;
            while (nextOccurrence <= utcNow)
            {
                nextOccurrence = scheduler.GetNextDateIntervalOccurrence(lastOccurrence, nextOccurrence);
            }

            //var days = (utcNow.Date - lastOccurrence.Date).Days;

            Assert.True(lastOccurrence.AddDays(weeksAdd * 7) == nextOccurrence);
            Assert.True(lastOccurrence.TimeOfDay == nextOccurrence.TimeOfDay);
        }
    }
}