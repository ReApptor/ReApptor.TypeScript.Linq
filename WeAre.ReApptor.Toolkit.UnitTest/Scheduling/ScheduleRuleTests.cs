using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using WeAre.ReApptor.Toolkit.Scheduling;
using WeAre.ReApptor.Toolkit.Scheduling.Entities;
using WeAre.ReApptor.Toolkit.Scheduling.Rules;
using WeAre.ReApptor.Toolkit.Scheduling.Rules.Daily;
using WeAre.ReApptor.Toolkit.Scheduling.Rules.Monthly;
using WeAre.ReApptor.Toolkit.Scheduling.Rules.Weekly;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest.Scheduling
{
    public sealed class ScheduleRuleTests
    {
        public ScheduleRuleTests()
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("fi");
        }

        private void AssertRuleMatch(string primaryRule, string[] rules, DateTime[] correctDates, DateTime? startDate = null, DateTime? endDate = null)
        {
            AssertRuleMatch(primaryRule, correctDates, startDate, endDate);
            
            string primaryScript = Scheduler.ToScript(primaryRule);
            
            foreach (string rule in rules)
            {
                AssertRuleMatch(rule, correctDates, startDate, endDate);
            
                string script = Scheduler.ToScript(rule);
                
                string error = $"Alternative rule \"{rule}\" does not math to the primary rule \"{rule}\" (Primary script: \"{primaryScript}\", alternative script: \"{script}\").";
                Assert.True(script == primaryScript, error);
            }
        }

        private void AssertRuleMatch(string rule, DateTime[] correctDates, DateTime? startDate = null, DateTime? endDate = null)
        {
            var begin = new DateTime(2014, 01, 01);
            var end = new DateTime(2016, 12, 31);
            if (startDate.HasValue)
            {
                begin = startDate.Value;
            }
            if (endDate.HasValue)
            {
                end = endDate.Value;
            }

            var scheduler = new Scheduler(rule);
            bool hasRunRules = scheduler.HasDailyRules;

            DateTime timestamp = begin;
            DateTime? lastOccurence = null;
            while (timestamp <= end)
            {
                bool shouldMatch = (correctDates.Any(x => x == timestamp));
                bool match = scheduler.Match(timestamp, lastOccurence);
                if (shouldMatch != match)
                {
                }
                if (match)
                {
                    lastOccurence = timestamp;
                }
                string matchValue = shouldMatch ? "MATCH" : "NOT MATCH";
                string error = $"Date \"{timestamp}\" does not math to the rule \"{rule}\" (Expected - {matchValue}).";
                Assert.True(shouldMatch == match, error);
                timestamp = (hasRunRules) ? timestamp.AddSeconds(10) : timestamp.AddDays(1);
            }

            DateTime[] occurrences = scheduler.GetOccurrences(begin, end);
            Assert.Equal(correctDates.Length, occurrences.Length);
            foreach (DateTime occurence in occurrences)
            {
                bool shouldMatch = (correctDates.Any(x => x == occurence));
                Assert.True(shouldMatch);
            }
        }

        [Fact]
        public void MonthsOfYearParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "1, 3, 5 Of January, February", new MonthsOfYearScheduleRule(MonthsOfYear.January | MonthsOfYear.February, new[] { 1, 3, 5 }, new int[0]), "1, 3, 5 Of January, February" },
                new object[] { "1, 3, 5 January, February", new MonthsOfYearScheduleRule(MonthsOfYear.January | MonthsOfYear.February, new[] { 1, 3, 5 }, new int[0]), "1, 3, 5 Of January, February" },
                new object[] { "1-3, 5 January, March-May", new MonthsOfYearScheduleRule(MonthsOfYear.January | MonthsOfYear.March | MonthsOfYear.April | MonthsOfYear.May, new[] { 1, 2, 3, 5 }, new int[0]), "1, 2, 3, 5 Of January, March, April, May" },
                new object[] { "1, 3, 5 Of January, February 2015", new MonthsOfYearScheduleRule(MonthsOfYear.January | MonthsOfYear.February, new[] { 1, 3, 5 }, new[] { 2015 }), "1, 3, 5 Of January, February 2015" },
                new object[] { "1, 3, 5 January, February 2015, 2016", new MonthsOfYearScheduleRule(MonthsOfYear.January | MonthsOfYear.February, new[] { 1, 3, 5 }, new[] { 2015, 2016 }), "1, 3, 5 Of January, February 2015, 2016" },
                new object[] { "1-3, 5 January, March-May 2015, 2017-2019", new MonthsOfYearScheduleRule(MonthsOfYear.January | MonthsOfYear.March | MonthsOfYear.April | MonthsOfYear.May, new[] { 1, 2, 3, 5 }, new[] { 2015, 2017, 2018, 2019 }), "1, 2, 3, 5 Of January, March, April, May 2015, 2017, 2018, 2019" },
            };
            #endregion

            var rule = new MonthsOfYearScheduleRule();
            var scheduler = new Scheduler();
            foreach (object[] data in testData)
            {
                var script = (string)data[0];
                var expectedScriptItem = (MonthsOfYearScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(script);
                string restoredScript = rule.ToScript();

                string errorMessage = $"Script \"{script}\" cannot be parsed.";
                Assert.True(expectedScriptItem.MonthsOfYear == rule.MonthsOfYear, errorMessage);
                Assert.True(expectedScriptItem.DaysNumbers.Length == rule.DaysNumbers.Length, errorMessage);
                for (int i = 0; i < expectedScriptItem.DaysNumbers.Length; i++)
                {
                    Assert.True(expectedScriptItem.DaysNumbers[i] == rule.DaysNumbers[i], errorMessage);
                }
                Assert.False(restoredScript == null, errorMessage);
                Assert.True(expectedRestoredConfig == restoredScript, errorMessage);

                scheduler.FromScript(script);
            }
        }

        [Fact]
        public void DaysOfWeekIterationParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "1, 3 x2", new DaysOfWeekIterationScheduleRule(DaysOfWeek.Monday | DaysOfWeek.Wednesday, 2), "Monday, Wednesday Every 2 Weeks" },
                new object[] { "1, 3 x 2", new DaysOfWeekIterationScheduleRule(DaysOfWeek.Monday | DaysOfWeek.Wednesday, 2), "Monday, Wednesday Every 2 Weeks" },
                new object[] { "5x3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.Friday, 3), "Friday Every 3 Weeks" },
                new object[] { "5 x 3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.Friday, 3), "Friday Every 3 Weeks" },
                new object[] { "5x 3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.Friday, 3), "Friday Every 3 Weeks" },
                new object[] { "5 x3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.Friday, 3), "Friday Every 3 Weeks" },
                new object[] { "x3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.All, 3), "All Every 3 Weeks" },
                new object[] { "All x3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.All, 3), "All Every 3 Weeks" },
                new object[] { "All x 3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.All, 3), "All Every 3 Weeks" },
                new object[] { "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday x3", new DaysOfWeekIterationScheduleRule(DaysOfWeek.All, 3), "All Every 3 Weeks" },
            };
            #endregion

            var rule = new DaysOfWeekIterationScheduleRule();
            var scheduler = new Scheduler();
            foreach (object[] data in testData)
            {
                var script = (string)data[0];
                var expectedScriptItem = (DaysOfWeekIterationScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(script);
                string restoredScript = rule.ToScript();

                string errorMessage = $"Script \"{script}\" cannot be parsed.";
                Assert.True(expectedScriptItem.DaysOfWeek == rule.DaysOfWeek, errorMessage);
                Assert.True(expectedScriptItem.WeeksInterval == rule.WeeksInterval, errorMessage);
                Assert.True(restoredScript != null, errorMessage);
                Assert.True(expectedRestoredConfig == restoredScript, errorMessage);

                scheduler.FromScript(script);
            }
        }

        [Fact]
        public void LastDaysOfWeekParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "Last Friday Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.Friday), "Last Friday Of Month" },
                new object[] { "Last Friday", new LastDaysOfWeekScheduleRule(DaysOfWeek.Friday), "Last Friday Of Month" },
                new object[] { "Last 5 Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.Friday), "Last Friday Of Month" },
                new object[] { "Last 5", new LastDaysOfWeekScheduleRule(DaysOfWeek.Friday), "Last Friday Of Month" },
                new object[] { "Last All Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last All", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last 0, 1, 2, 3, 4, 5, 6 Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last 0, 1, 2, 3, 4, 5, 6", new LastDaysOfWeekScheduleRule(DaysOfWeek.All), "Last All Of Month" },
                new object[] { "Last Sunday, Monday Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "Last Sunday, Monday Of Month" },
                new object[] { "Last Sunday, Monday", new LastDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "Last Sunday, Monday Of Month" },
                new object[] { "Last 0, 1 Of Month", new LastDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "Last Sunday, Monday Of Month" },
                new object[] { "Last 0, 1", new LastDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "Last Sunday, Monday Of Month" },
            };
            #endregion

            var rule = new LastDaysOfWeekScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (LastDaysOfWeekScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(expectedConfigItem.DaysOfWeek == rule.DaysOfWeek, errorMessage);
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void FirstDaysOfWeekParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "First Friday Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Friday), "First Friday Of Month" },
                new object[] { "First Friday", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Friday), "First Friday Of Month" },
                new object[] { "First 5 Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Friday), "First Friday Of Month" },
                new object[] { "First 5", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Friday), "First Friday Of Month" },
                new object[] { "First All Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First All", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First 0, 1, 2, 3, 4, 5, 6 Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First 0, 1, 2, 3, 4, 5, 6", new FirstDaysOfWeekScheduleRule(DaysOfWeek.All), "First All Of Month" },
                new object[] { "First Sunday, Monday Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "First Sunday, Monday Of Month" },
                new object[] { "First Sunday, Monday", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "First Sunday, Monday Of Month" },
                new object[] { "First 0, 1 Of Month", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "First Sunday, Monday Of Month" },
                new object[] { "First 0, 1", new FirstDaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "First Sunday, Monday Of Month" },
            };
            #endregion

            var rule = new FirstDaysOfWeekScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (FirstDaysOfWeekScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(expectedConfigItem.DaysOfWeek == rule.DaysOfWeek, errorMessage);
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void LastWeekOfMonthParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "Thursday, Friday Last Week", new LastWeekOfMonthScheduleRule(DaysOfWeek.Friday | DaysOfWeek.Thursday), "Thursday, Friday Last Week" },
                new object[] { "4, 5 last Week", new LastWeekOfMonthScheduleRule(DaysOfWeek.Friday | DaysOfWeek.Thursday), "Thursday, Friday Last Week" },
                new object[] { "All Last Week", new LastWeekOfMonthScheduleRule(DaysOfWeek.All), "All Last Week" },
                new object[] { "Last Week", new LastWeekOfMonthScheduleRule(DaysOfWeek.All), "All Last Week" },
                new object[] { "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Last Week", new LastWeekOfMonthScheduleRule(DaysOfWeek.All), "All Last Week" },
                new object[] { "0, 1, 2, 3, 4, 5, 6 Last Week", new LastWeekOfMonthScheduleRule(DaysOfWeek.All), "All Last Week" },
            };
            #endregion

            var rule = new LastWeekOfMonthScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (LastWeekOfMonthScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(expectedConfigItem.DaysOfWeek == rule.DaysOfWeek, errorMessage);
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void DaysOfWeekParsingTest()
        {
            //Sunday - Saturday, means: ALL
            //Recursive (if from day of week in interval higher then next, it goes to next week (recursive)):
            //Monday - Sunday, means: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday (1, 2, 3, 4, 5, 6, 0, 1) = days
            //Wednesday - Monday, means: Wednesday, Thursday, Friday, Saturday, Sunday, Monday (3, 4, 5, 6, 0, 1) = days

            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "Wednesday - Monday", new DaysOfWeekScheduleRule(DaysOfWeek.Wednesday | DaysOfWeek.Thursday | DaysOfWeek.Friday | DaysOfWeek.Monday | DaysOfWeek.Saturday | DaysOfWeek.Sunday | DaysOfWeek.Monday), "Sunday, Monday, Wednesday, Thursday, Friday, Saturday" },
                new object[] { "Monday - Sunday", new DaysOfWeekScheduleRule(DaysOfWeek.All), "All" },
                new object[] { "Sunday - Monday", new DaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday), "Sunday, Monday" },
                new object[] { "Sunday - Saturday", new DaysOfWeekScheduleRule(DaysOfWeek.All), "All" },
                new object[] { "Monday - Friday", new DaysOfWeekScheduleRule(DaysOfWeek.Monday | DaysOfWeek.Tuesday | DaysOfWeek.Wednesday | DaysOfWeek.Thursday | DaysOfWeek.Friday), "Monday, Tuesday, Wednesday, Thursday, Friday" },
                new object[] { "All", new DaysOfWeekScheduleRule(DaysOfWeek.All), "All" },
                new object[] { "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday", new DaysOfWeekScheduleRule(DaysOfWeek.All), "All" },
                new object[] { "Monday", new DaysOfWeekScheduleRule(DaysOfWeek.Monday), "Monday" },
                new object[] { "1", new DaysOfWeekScheduleRule(DaysOfWeek.Monday), "Monday" },
                new object[] { "Monday, Thursday", new DaysOfWeekScheduleRule(DaysOfWeek.Monday | DaysOfWeek.Thursday), "Monday, Thursday" },
                new object[] { "1, 4", new DaysOfWeekScheduleRule(DaysOfWeek.Monday | DaysOfWeek.Thursday), "Monday, Thursday" },
                new object[] { "0, 1, 2, 3, 4, 5, 6", new DaysOfWeekScheduleRule(DaysOfWeek.All), "All" },
                new object[] { "Sunday Week 1", new DaysOfWeekScheduleRule(DaysOfWeek.Sunday, new[] { 1 }), "Sunday Week 1" },
                new object[] { "0 Week 1", new DaysOfWeekScheduleRule(DaysOfWeek.Sunday, new[] { 1 }), "Sunday Week 1" },
                new object[] { "Sunday, Monday Week 2", new DaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday, new[] { 2 }), "Sunday, Monday Week 2" },
                new object[] { "0, 1 Week 2", new DaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday, new[] { 2 }), "Sunday, Monday Week 2" },
                new object[] { "Sunday, Monday Week 2, 4", new DaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday, new[] { 2, 4 }), "Sunday, Monday Week 2, 4" },
                new object[] { "0, 1 Week 2, 4", new DaysOfWeekScheduleRule(DaysOfWeek.Sunday | DaysOfWeek.Monday, new[] { 2, 4 }), "Sunday, Monday Week 2, 4" },
                new object[] { "All Week 1", new DaysOfWeekScheduleRule(DaysOfWeek.All, new[] { 1 }), "All Week 1" },
                new object[] { "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Week 1", new DaysOfWeekScheduleRule(DaysOfWeek.All, new[] { 1 }), "All Week 1" },
                new object[] { "0, 1, 2, 3, 4, 5, 6 Week 1", new DaysOfWeekScheduleRule(DaysOfWeek.All, new[] { 1 }), "All Week 1" },
                new object[] { "Week 1", new DaysOfWeekScheduleRule(DaysOfWeek.All, new[] { 1 }), "All Week 1" },
            };
            #endregion

            var rule = new DaysOfWeekScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (DaysOfWeekScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(expectedConfigItem.DaysOfWeek == rule.DaysOfWeek, errorMessage);
                Assert.True(expectedConfigItem.WeeksNumbers.Length == rule.WeeksNumbers.Length, errorMessage);
                for (int i = 0; i < expectedConfigItem.WeeksNumbers.Length; i++)
                {
                    Assert.True(expectedConfigItem.WeeksNumbers[i] == rule.WeeksNumbers[i], errorMessage);
                }
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void CalendarTimestampParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "01 January 2015", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },
                new object[] { "01.01.2015", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },
                new object[] { "1.1.2015", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },
                new object[] { "1-1-2015", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },
                new object[] { "01 January 15", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },
                new object[] { "01.01.15", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },
                new object[] { "1.1.15", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },
                new object[] { "1-1-15", new CalendarTimestampScheduleRule(01, MonthOfYear.January, 2015), "01 January 2015" },

                new object[] { "01 January", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.*", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.**", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.****", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "1.1.*", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "1.1.**", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "1.1.YY", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "1.1.YYYY", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "1-1-*", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },

                new object[] { "January 2015", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "January 15", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "01.2015", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "*.01.2015", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "**.01.2015", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "DD.01.2015", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "DD.01.15", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "*.1.2015", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "**.1.2015", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "*.1.15", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },
                new object[] { "**.1.15", new CalendarTimestampScheduleRule(null, MonthOfYear.January, 2015), "January 2015" },

                new object[] { "01 January", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01 January YYYY", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01 January *", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.*", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.**", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.****", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.YY", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },
                new object[] { "01.01.YYYY", new CalendarTimestampScheduleRule(01, MonthOfYear.January, null), "01 January" },

            };
            #endregion

            var rule = new CalendarTimestampScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (CalendarTimestampScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(rule.CalendarTimestamp != null, errorMessage);
                Assert.True(expectedConfigItem.CalendarTimestamp == rule.CalendarTimestamp, errorMessage);
                Assert.True(expectedConfigItem.CalendarTimestamp.Day == rule.CalendarTimestamp.Day, errorMessage);
                Assert.True(expectedConfigItem.CalendarTimestamp.Month == rule.CalendarTimestamp.Month, errorMessage);
                Assert.True(expectedConfigItem.CalendarTimestamp.Year == rule.CalendarTimestamp.Year, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void CalendarIntervalParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "01 January 2015 - 25 February 2016", new CalendarIntervalScheduleRule(new CalendarTimestamp(01, MonthOfYear.January, 2015), new CalendarTimestamp(25, MonthOfYear.February, 2016)), "01 January 2015 - 25 February 2016" },
                new object[] { "January 2015 - February 2016", new CalendarIntervalScheduleRule(new CalendarTimestamp(null, MonthOfYear.January, 2015), new CalendarTimestamp(null, MonthOfYear.February, 2016)), "January 2015 - February 2016" },
                new object[] { "January - February", new CalendarIntervalScheduleRule(new CalendarTimestamp(null, MonthOfYear.January, null), new CalendarTimestamp(null, MonthOfYear.February, null)), "January - February" },
                new object[] { "01 January - 25 February", new CalendarIntervalScheduleRule(new CalendarTimestamp(01, MonthOfYear.January, null), new CalendarTimestamp(25, MonthOfYear.February, null)), "01 January - 25 February" },
            };
            #endregion

            var rule = new CalendarIntervalScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (CalendarIntervalScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(rule.CalendarInterval != null, errorMessage);
                Assert.True(expectedConfigItem.CalendarInterval == rule.CalendarInterval, errorMessage);
                Assert.True(expectedConfigItem.CalendarInterval.From == rule.CalendarInterval.From, errorMessage);
                Assert.True(expectedConfigItem.CalendarInterval.To == rule.CalendarInterval.To, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void RunBetweenParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "Between - 15:00", new RunBetweenScheduleRule(null, new CalendarTime(15, 0)), "Between 00:00 - 15:00" },
                new object[] { "Between -15:00", new RunBetweenScheduleRule(null, new CalendarTime(15, 0)), "Between 00:00 - 15:00" },
                new object[] { "Between 10:00 -", new RunBetweenScheduleRule(new CalendarTime(10, 0), null), "Between 10:00 - 23:59" },
                new object[] { "Between 10:00-", new RunBetweenScheduleRule(new CalendarTime(10, 0), null), "Between 10:00 - 23:59" },
                new object[] { "Between 10:00 - 15:00", new RunBetweenScheduleRule(new CalendarTime(10, 0), new CalendarTime(15, 0)), "Between 10:00 - 15:00" },
                new object[] { "Between 10:00-15:00", new RunBetweenScheduleRule(new CalendarTime(10, 0), new CalendarTime(15, 0)), "Between 10:00 - 15:00" },
                new object[] { "Run between - 15:00", new RunBetweenScheduleRule(null, new CalendarTime(15, 0)), "Between 00:00 - 15:00" },
                new object[] { "Run between -15:00", new RunBetweenScheduleRule(null, new CalendarTime(15, 0)), "Between 00:00 - 15:00" },
                new object[] { "Run between 10:00 -", new RunBetweenScheduleRule(new CalendarTime(10, 0), null), "Between 10:00 - 23:59" },
                new object[] { "Run between 10:00-", new RunBetweenScheduleRule(new CalendarTime(10, 0), null), "Between 10:00 - 23:59" },
                new object[] { "Run between 10:00 - 15:00", new RunBetweenScheduleRule(new CalendarTime(10, 0), new CalendarTime(15, 0)), "Between 10:00 - 15:00" },
                new object[] { "Run between 10:00-15:00", new RunBetweenScheduleRule(new CalendarTime(10, 0), new CalendarTime(15, 0)), "Between 10:00 - 15:00" },
            };
            #endregion

            var rule = new RunBetweenScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (RunBetweenScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(rule.From != null, errorMessage);
                Assert.True(rule.To != null, errorMessage);
                Assert.True(expectedConfigItem.From == rule.From, errorMessage);
                Assert.True(expectedConfigItem.To == rule.To, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void RunBetweenDaysOfWeekParsingTest()
        {
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "Between Tuesday 10:00 - Thursday 15:00", new RunBetweenDaysOfWeekRule(DayOfWeek.Tuesday, new CalendarTime(10, 0), DayOfWeek.Thursday, new CalendarTime(15, 0)), "Between Tuesday 10:00 - Thursday 15:00" },
                new object[] { "Between Tuesday 10:00-Thursday 15:00", new RunBetweenDaysOfWeekRule(DayOfWeek.Tuesday, new CalendarTime(10, 0), DayOfWeek.Thursday, new CalendarTime(15, 0)), "Between Tuesday 10:00 - Thursday 15:00" }
                //new object[] { "Between Tuesday - Thursday 15:00", new RunBetweenDaysOfWeekRule(DayOfWeek.Tuesday, null, DayOfWeek.Thursday, new CalendarTime(15, 0)), "Between Tuesday 00:00 - Thursday 15:00" },
                //new object[] { "Between Tuesday -Thursday 15:00", new RunBetweenDaysOfWeekRule(DayOfWeek.Tuesday, null, DayOfWeek.Thursday, new CalendarTime(15, 0)), "Between Tuesday 00:00 - Thursday 15:00" },
                //new object[] { "Between Tuesday 10:00 - Thursday", new RunBetweenDaysOfWeekRule(DayOfWeek.Tuesday, new CalendarTime(10, 0), DayOfWeek.Thursday, null), "Between Tuesday 10:00 - Thursday 23:59" },
                //new object[] { "Between Tuesday 10:00-Thursday", new RunBetweenDaysOfWeekRule(DayOfWeek.Tuesday, new CalendarTime(10, 0), DayOfWeek.Thursday, null), "Between Tuesday 10:00 - Thursday 23:59" },
            };
            #endregion

            var rule = new RunBetweenDaysOfWeekRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (RunBetweenDaysOfWeekRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.True(restoredConfig != null, errorMessage);
                Assert.True(rule.TimeFrom != null, errorMessage);
                Assert.True(rule.TimeTo != null, errorMessage);
                Assert.True(expectedConfigItem.TimeFrom == rule.TimeFrom, errorMessage);
                Assert.True(expectedConfigItem.TimeTo == rule.TimeTo, errorMessage);
                Assert.True(expectedConfigItem.DayOfWeekFrom == rule.DayOfWeekFrom, errorMessage);
                Assert.True(expectedConfigItem.DayOfWeekTo == rule.DayOfWeekTo, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void RunOnceScheduleRuleParsingTest()
        {
            //[Run] Once [At] {Time}
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "Run Once At 05:25", new RunOnceScheduleRule(new CalendarTime(05, 25)), "Run Once At 05:25" },
                new object[] { "Once At 05:25", new RunOnceScheduleRule(new CalendarTime(05, 25)), "Run Once At 05:25" },
                new object[] { "Run Once 05:25", new RunOnceScheduleRule(new CalendarTime(05, 25)), "Run Once At 05:25" },
                new object[] { "Once 05:25", new RunOnceScheduleRule(new CalendarTime(05, 25)), "Run Once At 05:25" },
            };
            #endregion

            var rule = new RunOnceScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (RunOnceScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.False(restoredConfig == null, errorMessage);
                Assert.NotNull(rule.Interval);
                Assert.True(expectedConfigItem.Interval.Hour == rule.Interval.Hour, errorMessage);
                Assert.True(expectedConfigItem.Interval.Min == rule.Interval.Min, errorMessage);
                Assert.True(expectedConfigItem.Interval == rule.Interval, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void RunIntervalScheduleRuleParsingTest()
        {
            //[Run] [With] Interval {Time}
            #region Test Data
            var testData = new List<object[]>
            {
                new object[] { "Run With Interval 00:05 From 10:00 To 20:00", new RunIntervalScheduleRule(new CalendarTime(00, 05), new CalendarTime(10, 00), new CalendarTime(20, 00)), "Run With Interval 00:05 From 10:00 To 20:00" },
                new object[] { "Run With Interval 00:05 From 10:00", new RunIntervalScheduleRule(new CalendarTime(00, 05), new CalendarTime(10, 00), null), "Run With Interval 00:05 From 10:00" },
                new object[] { "Run With Interval 00:05 To 20:00", new RunIntervalScheduleRule(new CalendarTime(00, 05), null, new CalendarTime(20, 00)), "Run With Interval 00:05 To 20:00" },
                new object[] { "Run With Interval 00:05", new RunIntervalScheduleRule(new CalendarTime(00, 05), null, null), "Run With Interval 00:05" },
                new object[] { "Interval 00:05", new RunIntervalScheduleRule(new CalendarTime(00, 05), null, null), "Run With Interval 00:05" },
                new object[] { "Run Interval 00:05", new RunIntervalScheduleRule(new CalendarTime(00, 05), null, null), "Run With Interval 00:05" },
                new object[] { "With Interval 00:05", new RunIntervalScheduleRule(new CalendarTime(00, 05), null, null), "Run With Interval 00:05" },
                new object[] { "Interval 00:05", new RunIntervalScheduleRule(new CalendarTime(00, 05), null, null), "Run With Interval 00:05" },
                new object[] { "Run With Interval 90", new RunIntervalScheduleRule(new CalendarTime(01, 30), null, null), "Run With Interval 01:30" },
            };

            #endregion

            var rule = new RunIntervalScheduleRule();
            foreach (object[] data in testData)
            {
                var config = (string)data[0];
                var expectedConfigItem = (RunIntervalScheduleRule)data[1];
                var expectedRestoredConfig = (string)data[2];

                rule.FromScript(config);
                string restoredConfig = rule.ToScript();

                string errorMessage = $"Configuration \"{config}\" cannot be parsed.";
                Assert.False(restoredConfig == null, errorMessage);
                Assert.NotNull(rule.Interval);
                Assert.True(expectedConfigItem.Interval.Hour == rule.Interval.Hour, errorMessage);
                Assert.True(expectedConfigItem.Interval.Min == rule.Interval.Min, errorMessage);
                Assert.True(expectedConfigItem.Interval == rule.Interval, errorMessage);
                Assert.True(expectedConfigItem.From == rule.From, errorMessage);
                Assert.True(expectedConfigItem.To == rule.To, errorMessage);
                Assert.True(expectedRestoredConfig == restoredConfig, errorMessage);
            }
        }

        [Fact]
        public void CommonParsingTest()
        {
            var x = ScheduleConfigParser.Parse("{MonthsOfYear}", "January-March");

            Assert.NotNull(x);
            Assert.True(x.ContainsKey("MonthsOfYear"));
            Assert.Equal("January, February, March", x["MonthsOfYear"]);

            x = ScheduleConfigParser.Parse("{WeeksNumbers}", "1-3");

            Assert.NotNull(x);
            Assert.True(x.ContainsKey("WeeksNumbers"));
            Assert.Equal("1, 2, 3", x["WeeksNumbers"]);

            x = ScheduleConfigParser.Parse("{DaysOfWeek}", "Sunday-Tuesday");

            Assert.NotNull(x);
            Assert.True(x.ContainsKey("DaysOfWeek"));
            Assert.Equal("Sunday, Monday, Tuesday", x["DaysOfWeek"]);

            x = ScheduleConfigParser.Parse("{DaysOfWeek} [Week {WeeksNumbers}]", "Sunday, Monday");

            Assert.NotNull(x);

            x = ScheduleConfigParser.Parse("{DaysOfWeek} [Week {WeeksNumbers}]", "Sunday, Monday");

            Assert.NotNull(x);

            x = ScheduleConfigParser.Parse("{DaysOfWeek} [Week {WeeksNumbers}]", "Sunday, Monday Week 2, 4");

            Assert.NotNull(x);
        }

        [Fact]
        public void SchedulerDailyDaysOfWeekParsingTest()
        {
            const string rule = "January 2015; April 2015; Wednesday, Thursday";
            DateTime[] dates =
            {
                                            new DateTime(2015, 01, 01),
                new DateTime(2015, 01, 07), new DateTime(2015, 01, 08),
                new DateTime(2015, 01, 14), new DateTime(2015, 01, 15),
                new DateTime(2015, 01, 21), new DateTime(2015, 01, 22),
                new DateTime(2015, 01, 28), new DateTime(2015, 01, 29),
                new DateTime(2015, 04, 01), new DateTime(2015, 04, 02),
                new DateTime(2015, 04, 08), new DateTime(2015, 04, 09),
                new DateTime(2015, 04, 15), new DateTime(2015, 04, 16),
                new DateTime(2015, 04, 22), new DateTime(2015, 04, 23),
                new DateTime(2015, 04, 29), new DateTime(2015, 04, 30)
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerDailyDaysOfWeekWeekNumberParsingTest()
        {
            const string rule = "January - February 2015; Monday, Tuesday, Wednesday Week 1,2";
            
            DateTime[] dates =
            {
                new DateTime(2015, 01, 05), new DateTime(2015, 01, 06), new DateTime(2015, 01, 07),
                new DateTime(2015, 02, 02), new DateTime(2015, 02, 03), new DateTime(2015, 02, 04)
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerDailyDaysOfWeekIterationTest()
        {
            const string rule = "10 February - 25 March 2015; Friday, Saturday Every 2 Weeks";
            
            DateTime[] dates =
            {
                new DateTime(2015, 02, 13), new DateTime(2015, 02, 14),
                new DateTime(2015, 02, 27), new DateTime(2015, 02, 28),
                new DateTime(2015, 03, 13), new DateTime(2015, 03, 14),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerFirstDaysOfWeekTest()
        {
            const string rule = "February - March 2015; February - March 2016; First Monday, Tuesday Of Month";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 02), new DateTime(2015, 02, 03),
                new DateTime(2015, 03, 02), new DateTime(2015, 03, 03),
                new DateTime(2016, 02, 01), new DateTime(2016, 02, 02),
                new DateTime(2016, 03, 01), new DateTime(2016, 03, 07),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerLastDaysOfWeekTest()
        {
            const string rule = "December; Last Friday Of Month";
            DateTime[] dates =
            {
                new DateTime(2014, 12, 26), new DateTime(2015, 12, 25), new DateTime(2016, 12, 30),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerMonthlyIntervalTest()
        {
            const string rule = "12-14 February; 15-17 February; 18-19 March;";
            DateTime[] dates =
            {
                new DateTime(2014, 02, 12), new DateTime(2014, 02, 13), new DateTime(2014, 02, 14),
                new DateTime(2014, 02, 15), new DateTime(2014, 02, 16), new DateTime(2014, 02, 17),
                new DateTime(2014, 03, 18), new DateTime(2014, 03, 19),
                new DateTime(2015, 02, 12), new DateTime(2015, 02, 13), new DateTime(2015, 02, 14),
                new DateTime(2015, 02, 15), new DateTime(2015, 02, 16), new DateTime(2015, 02, 17),
                new DateTime(2015, 03, 18), new DateTime(2015, 03, 19),
                new DateTime(2016, 02, 12), new DateTime(2016, 02, 13), new DateTime(2016, 02, 14),
                new DateTime(2016, 02, 15), new DateTime(2016, 02, 16), new DateTime(2016, 02, 17),
                new DateTime(2016, 03, 18), new DateTime(2016, 03, 19),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerMonthsOfYearTest()
        {
            const string rule = "1, 3, 5 January, February";
            DateTime[] dates =
            {
                new DateTime(2014, 01, 01), new DateTime(2014, 01, 03), new DateTime(2014, 01, 05),
                new DateTime(2014, 02, 01), new DateTime(2014, 02, 03), new DateTime(2014, 02, 05),
                new DateTime(2015, 01, 01), new DateTime(2015, 01, 03), new DateTime(2015, 01, 05),
                new DateTime(2015, 02, 01), new DateTime(2015, 02, 03), new DateTime(2015, 02, 05),
                new DateTime(2016, 01, 01), new DateTime(2016, 01, 03), new DateTime(2016, 01, 05),
                new DateTime(2016, 02, 01), new DateTime(2016, 02, 03), new DateTime(2016, 02, 05),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerOnceTest()
        {
            const string rule = "11, 13 February 2015;Once At 05:00;";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 11, 05, 00, 00), new DateTime(2015, 02, 13, 05, 00, 00)
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerHourOnceTest()
        {
            const string rule = "11, 13 February 2015;Once At 05:*;";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 11, 05, 00, 00), new DateTime(2015, 02, 13, 05, 00, 00)
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerFridayOnceAt10Test()
        {
            const string rule = "13, 20 November 2015;Once At 22:*;Friday;";
            DateTime[] dates =
            {
                new DateTime(2015, 11, 13, 22, 00, 00),
                new DateTime(2015, 11, 20, 22, 00, 00)
            };

            AssertRuleMatch(rule, dates);

            var scheduler = new Scheduler(rule);
            bool isMatch = scheduler.Match(new DateTime(2015, 11, 13, 22, 05, 00));
            
            Assert.True(isMatch);
            
            isMatch = scheduler.Match(new DateTime(2015, 11, 20, 22, 15, 00), new DateTime(2015, 11, 13, 22, 05, 00));
            
            Assert.True(isMatch);
        }

        [Fact]
        public void SchedulerIntervalPer30SecondsTest()
        {
            const string rule = "01 February 2015;With interval 00:30 From 12:00 To 13:00;";

            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 12, 00, 00),
                new DateTime(2015, 02, 01, 12, 30, 00),
                new DateTime(2015, 02, 01, 13, 00, 00)
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerIntervalIntervalPerMinuteTest()
        {
            const string rule = "With interval 00:01;";

            var begin = new DateTime(2015, 02, 01, 00, 00, 00);
            var end = new DateTime(2015, 02, 02, 00, 00, 00);

            var dates = new List<DateTime>();
            DateTime date = begin;
            while (date <= end)
            {
                dates.Add(date);
                date = date.AddMinutes(1);
            }

            AssertRuleMatch(rule, dates.ToArray(), begin, end);
        }

        [Fact]
        public void SchedulerIntervalEveryHourTest()
        {
            const string rule = "01 February 2015;With interval 01:00;";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 00, 00, 00),
                new DateTime(2015, 02, 01, 01, 00, 00),
                new DateTime(2015, 02, 01, 02, 00, 00),
                new DateTime(2015, 02, 01, 03, 00, 00),
                new DateTime(2015, 02, 01, 04, 00, 00),
                new DateTime(2015, 02, 01, 05, 00, 00),
                new DateTime(2015, 02, 01, 06, 00, 00),
                new DateTime(2015, 02, 01, 07, 00, 00),
                new DateTime(2015, 02, 01, 08, 00, 00),
                new DateTime(2015, 02, 01, 09, 00, 00),
                new DateTime(2015, 02, 01, 10, 00, 00),
                new DateTime(2015, 02, 01, 11, 00, 00),
                new DateTime(2015, 02, 01, 12, 00, 00),
                new DateTime(2015, 02, 01, 13, 00, 00),
                new DateTime(2015, 02, 01, 14, 00, 00),
                new DateTime(2015, 02, 01, 15, 00, 00),
                new DateTime(2015, 02, 01, 16, 00, 00),
                new DateTime(2015, 02, 01, 17, 00, 00),
                new DateTime(2015, 02, 01, 18, 00, 00),
                new DateTime(2015, 02, 01, 19, 00, 00),
                new DateTime(2015, 02, 01, 20, 00, 00),
                new DateTime(2015, 02, 01, 21, 00, 00),
                new DateTime(2015, 02, 01, 22, 00, 00),
                new DateTime(2015, 02, 01, 23, 00, 00),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerIntervalInverseTimeTest()
        {
            const string rule = "01-02 February 2015;With interval 00:30 From 23:30 To 01:00;";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 00, 00, 00),
                new DateTime(2015, 02, 01, 00, 30, 00),
                new DateTime(2015, 02, 01, 01, 00, 00),
                new DateTime(2015, 02, 01, 23, 30, 00),

                new DateTime(2015, 02, 02, 00, 00, 00),
                new DateTime(2015, 02, 02, 00, 30, 00),
                new DateTime(2015, 02, 02, 01, 00, 00),
                new DateTime(2015, 02, 02, 23, 30, 00),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerIntervalWithoutFromTest()
        {
            const string rule = "01 February 2015;With interval 00:30 To 01:00;";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 00, 00, 00),
                new DateTime(2015, 02, 01, 00, 30, 00),
                new DateTime(2015, 02, 01, 01, 00, 00),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerIntervalWithoutToTest()
        {
            const string rule = "01 February 2015;With interval 00:30 From 22:30;";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 22, 30, 00),
                new DateTime(2015, 02, 01, 23, 00, 00),
                new DateTime(2015, 02, 01, 23, 30, 00)
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void SchedulerIntervalWithoutFromWithoutToTest()
        {
            const string rule = "01 February 2015;With interval 01:00;";
            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 00, 00, 00), new DateTime(2015, 02, 01, 01, 00, 00),
                new DateTime(2015, 02, 01, 02, 00, 00), new DateTime(2015, 02, 01, 03, 00, 00),
                new DateTime(2015, 02, 01, 04, 00, 00), new DateTime(2015, 02, 01, 05, 00, 00),
                new DateTime(2015, 02, 01, 06, 00, 00), new DateTime(2015, 02, 01, 07, 00, 00),
                new DateTime(2015, 02, 01, 08, 00, 00), new DateTime(2015, 02, 01, 09, 00, 00),
                new DateTime(2015, 02, 01, 10, 00, 00), new DateTime(2015, 02, 01, 11, 00, 00),
                new DateTime(2015, 02, 01, 12, 00, 00), new DateTime(2015, 02, 01, 13, 00, 00),
                new DateTime(2015, 02, 01, 14, 00, 00), new DateTime(2015, 02, 01, 15, 00, 00),
                new DateTime(2015, 02, 01, 16, 00, 00), new DateTime(2015, 02, 01, 17, 00, 00),
                new DateTime(2015, 02, 01, 18, 00, 00), new DateTime(2015, 02, 01, 19, 00, 00),
                new DateTime(2015, 02, 01, 20, 00, 00), new DateTime(2015, 02, 01, 21, 00, 00),
                new DateTime(2015, 02, 01, 22, 00, 00), new DateTime(2015, 02, 01, 23, 00, 00),
            };

            AssertRuleMatch(rule, dates);
        }

        [Fact]
        public void IntervalRuleGetNextOccurrenceTest()
        {
            const string rule = "Run With Interval 05:00 From 07:00 To 12:30";

            var scheduler = new Scheduler(rule);

            bool isSchedulerValid = (!scheduler.HasDailyRules) || (scheduler.DailyRules.All(item => (item is RunIntervalScheduleRule)));

            Assert.True(isSchedulerValid);

            DateTime now = DateTime.Now;
            DateTime timestamp = new DateTime(now.Year, now.Month, now.Day, 12, 0, 0);
            DateTime expectedNext = new DateTime(now.Year, now.Month, now.Day, 12, 1, 0);

            DateTime? next = scheduler.GetNextOccurrence(timestamp);

            Assert.True(next.HasValue);
            Assert.Equal(expectedNext, next.Value);
        }

        [Fact]
        public void IntervalRuleGetNextOccurrenceTest2()
        {
            const string rule = "Run With Interval 01:00:00 From 04:00 To 19:00";

            var scheduler = new Scheduler(rule);

            bool isSchedulerValid = (!scheduler.HasDailyRules) || (scheduler.DailyRules.All(item => (item is RunIntervalScheduleRule)));

            Assert.True(isSchedulerValid);

            DateTime now = DateTime.Now;
            DateTime timestamp = new DateTime(now.Year, now.Month, now.Day, 11, 5, 0);
            DateTime lastOccurrence = new DateTime(now.Year, now.Month, now.Day, 11, 0, 0);
            DateTime expectedNext = new DateTime(now.Year, now.Month, now.Day, 12, 00, 0);

            DateTime? next = scheduler.GetNextOccurrence(timestamp, lastOccurrence);

            Assert.True(next.HasValue);
            Assert.Equal(expectedNext, next.Value);
        }

        [Fact]
        public void SchedulerIntervalRuleTestShouldRun()
        {
            const string rule = "Run With Interval 00:01 From 12:22 To 12:30";

            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 12, 22, 00), new DateTime(2015, 02, 01, 12, 23, 00),
                new DateTime(2015, 02, 01, 12, 24, 00), new DateTime(2015, 02, 01, 12, 25, 00),
                new DateTime(2015, 02, 01, 12, 26, 00), new DateTime(2015, 02, 01, 12, 27, 00),
                new DateTime(2015, 02, 01, 12, 28, 00), new DateTime(2015, 02, 01, 12, 29, 00),
                new DateTime(2015, 02, 01, 12, 30, 00)
            };

            AssertRuleMatch(rule, dates, new DateTime(2015, 02, 01, 12, 22, 00), new DateTime(2015, 02, 01, 12, 30, 00));
        }

        [Fact]
        public void SchedulerIntervalRuleRunTwiceTest()
        {
            const string rule = "Run With Interval 05:00 From 07:00 To 12:30";

            var start = new DateTime(2015, 02, 01, 00, 00, 00);
            var end = new DateTime(2015, 02, 02, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2015, 02, 01, 07, 00, 00), new DateTime(2015, 02, 01, 12, 00, 00),
                new DateTime(2015, 02, 02, 07, 00, 00), new DateTime(2015, 02, 02, 12, 00, 00),
            };

            AssertRuleMatch(rule, dates, start, end);
        }

        [Fact]
        public void BetweenRuleTest()
        {
            const string rule = "Monday; Between 10:00 - 12:00";

            DateTime now = DateTime.Now;
            var begin = new DateTime(now.Year, 01, 01);
            var end = new DateTime(now.Year, 12, 31);

            var scheduler = new Scheduler(rule);

            bool isSchedulerValid =
                (!scheduler.HasDailyRules) ||
                (scheduler.DailyRules.All(item => (item is RunBetweenDaysOfWeekRule) || (item is RunBetweenScheduleRule)));

            Assert.True(isSchedulerValid);

            DateTime[] occurrences = scheduler.GetOccurrences(begin, end);

            Assert.NotNull(occurrences);
            Assert.True(occurrences.Length > 0);

            foreach (DateTime item in occurrences)
            {
                Assert.Equal(DayOfWeek.Monday, item.DayOfWeek);
                Assert.True(item.TimeOfDay >= new TimeSpan(10, 0, 0));
                Assert.True(item.TimeOfDay <= new TimeSpan(12, 0, 0));
            }
        }

        [Fact]
        public void BetweenMonthsRuleTest()
        {
            const string rule = "January-March;";

            DateTime now = DateTime.Now;
            var begin = new DateTime(now.Year, 01, 01);
            var end = new DateTime(now.Year, 12, 31);

            var scheduler = new Scheduler(rule);

            DateTime[] occurrences = scheduler.GetOccurrences(begin, end);

            Assert.NotNull(occurrences);
            Assert.True(occurrences.Length > 0);

            foreach (DateTime item in occurrences)
            {
                Assert.True(item.Month >= 1);
                Assert.True(item.Month <= 3);
            }
        }

        [Fact]
        public void OnceBetweenMondayFridayTest()
        {
            const string rule = "Monday-Friday; Once At 05:25;";

            var start = new DateTime(2020, 12, 01, 00, 00, 00);
            var end = new DateTime(2020, 12, 15, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2020, 12, 01, 05, 25, 00),
                new DateTime(2020, 12, 02, 05, 25, 00),
                new DateTime(2020, 12, 03, 05, 25, 00),
                new DateTime(2020, 12, 04, 05, 25, 00),
                new DateTime(2020, 12, 07, 05, 25, 00),
                new DateTime(2020, 12, 08, 05, 25, 00),
                new DateTime(2020, 12, 09, 05, 25, 00),
                new DateTime(2020, 12, 10, 05, 25, 00),
                new DateTime(2020, 12, 11, 05, 25, 00),
                new DateTime(2020, 12, 14, 05, 25, 00),
                new DateTime(2020, 12, 15, 05, 25, 00),
            };

            AssertRuleMatch(rule, dates, start, end);
        }

        [Fact]
        public void FirstDayOfAnyMonthUsingMonthsOfYearScheduleRuleTest()
        {
            const string rule = "1 of any month; Once At 05:25;";
            string[] alternativeRules = { "1 of any; Once At 05:25;" };

            var start = new DateTime(2020, 10, 01, 00, 00, 00);
            var end = new DateTime(2020, 12, 31, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2020, 10, 01, 05, 25, 00),
                new DateTime(2020, 11, 01, 05, 25, 00),
                new DateTime(2020, 12, 01, 05, 25, 00),
            };

            AssertRuleMatch(rule, alternativeRules, dates, start, end);
        }

        [Fact]
        public void FirstDayOfAnyMonthTest()
        {
            const string rule = "First day of month; Once At 05:25;";

            var start = new DateTime(2020, 10, 01, 00, 00, 00);
            var end = new DateTime(2020, 12, 31, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2020, 10, 01, 05, 25, 00),
                new DateTime(2020, 11, 01, 05, 25, 00),
                new DateTime(2020, 12, 01, 05, 25, 00),
            };

            AssertRuleMatch(rule, dates, start, end);
        }

        [Fact]
        public void LastDayOfAnyMonthTest()
        {
            const string rule = "Last day of month; Once At 05:25;";

            var start = new DateTime(2020, 10, 01, 00, 00, 00);
            var end = new DateTime(2020, 12, 31, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2020, 10, 31, 05, 25, 00),
                new DateTime(2020, 11, 30, 05, 25, 00),
                new DateTime(2020, 12, 31, 05, 25, 00),
            };

            AssertRuleMatch(rule, dates, start, end);
        }
        
        [Fact]
        public void MiddleDayOfAnyMonthTest()
        {
            const string rule = "Middle day of month; Once At 05:25;";

            var start = new DateTime(2021, 10, 01, 00, 00, 00);
            var end = new DateTime(2022, 02, 28, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2021, 10, 15, 05, 25, 00),
                 new DateTime(2021, 11, 15, 05, 25, 00),
                 new DateTime(2021, 12, 15, 05, 25, 00),
                 new DateTime(2022, 01, 15, 05, 25, 00),
                 new DateTime(2022, 02, 14, 05, 25, 00),
            };

            AssertRuleMatch(rule, dates, start, end);
        }

        [Fact]
        public void FirstWorkingOfAnyMonthTest()
        {
            const string rule = "First working day; Once At 05:25;";

            var start = new DateTime(2020, 10, 01, 00, 00, 00);
            var end = new DateTime(2020, 12, 31, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2020, 10, 01, 05, 25, 00),
                new DateTime(2020, 11, 02, 05, 25, 00),
                new DateTime(2020, 12, 01, 05, 25, 00),
            };

            AssertRuleMatch(rule, dates, start, end);
        }

        [Fact]
        public void LastWorkingOfAnyMonthTest()
        {
            const string rule = "Last working day; Once At 05:25;";

            var start = new DateTime(2020, 10, 01, 00, 00, 00);
            var end = new DateTime(2020, 12, 31, 23, 59, 59);

            DateTime[] dates =
            {
                new DateTime(2020, 10, 30, 05, 25, 00),
                new DateTime(2020, 11, 30, 05, 25, 00),
                new DateTime(2020, 12, 31, 05, 25, 00),
            };

            AssertRuleMatch(rule, dates, start, end);
        }
    }
}