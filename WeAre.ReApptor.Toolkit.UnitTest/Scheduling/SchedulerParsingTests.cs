using WeAre.ReApptor.Toolkit.Scheduling;
using WeAre.ReApptor.Toolkit.Scheduling.Rules.Monthly;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest.Scheduling
{
    public sealed class SchedulerParsingTests
    {
        [Fact]
        public void RestoreDateIntervalValuesSchedulerFromStringTest()
        {
            const int monthAdd = 1;
            const int daysAdd = 1;
            const int weeksAdd = 5;
            const int yearsAdd = 2;

            string monthIntervalScript = $"Add {monthAdd} Months";
            string yearsIntervalScript = $"Add {yearsAdd} years";
            string weekIntervalScript = $"Add {weeksAdd} Weeks";
            string dayIntervalScript = $"Add {daysAdd} days";

            var rule = new DateIntervalScheduleRule();

            rule.FromScript(monthIntervalScript);
            Assert.True(rule.DateIntervalValue == monthAdd);
            Assert.True(rule.DateIntervalType == DateInterval.Months);

            rule.FromScript(yearsIntervalScript);
            Assert.True(rule.DateIntervalValue == yearsAdd);
            Assert.True(rule.DateIntervalType == DateInterval.Years);

            rule.FromScript(weekIntervalScript);
            Assert.True(rule.DateIntervalValue == weeksAdd);
            Assert.True(rule.DateIntervalType == DateInterval.Weeks);

            rule.FromScript(dayIntervalScript);
            Assert.True(rule.DateIntervalValue == daysAdd);
            Assert.True(rule.DateIntervalType == DateInterval.Days);
        }
    }
}