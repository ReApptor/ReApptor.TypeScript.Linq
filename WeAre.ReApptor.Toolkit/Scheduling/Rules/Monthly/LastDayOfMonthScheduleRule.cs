using System;
using System.Linq;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Monthly
{
    [ScheduleRule(@"Last day [Of] [{MonthsOfYear}] [month] [{Years}]", Scheduler.MonthlyRulesPriority)]
    // ReSharper disable once UnusedType.Global
    public class LastDayOfMonthScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public LastDayOfMonthScheduleRule()
        {
        }

        public LastDayOfMonthScheduleRule(MonthsOfYear monthsOfYear, int[] years)
        {
            MonthsOfYear = monthsOfYear;
            Years = years ?? new int[0];
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            string years = (Years.Length > 0)
                ? " " + string.Join(", ", Years.Select(number => number.ToString()))
                : string.Empty;
            return $"First day Of {MonthsOfYear.ToEnumString()}{years}";
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            bool match = (MonthsOfYear.Has(timestamp.GetMonthOfYear()));
            match &= (timestamp.IsLastDayOfMonth());
            match &= (Years.Length == 0) || (Years.Any(year => year == timestamp.Year));
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public MonthsOfYear MonthsOfYear { get; internal set; }

        [ScheduleConfigItem]
        public int[] Years { get; internal set; }

        #endregion
    }
}