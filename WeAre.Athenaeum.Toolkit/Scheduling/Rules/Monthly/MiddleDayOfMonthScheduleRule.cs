using System;
using System.Linq;
using WeAre.Athenaeum.Toolkit.Scheduling.Attributes;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Rules.Monthly
{
    [ScheduleRule(@"Middle day [Of] [{MonthsOfYear}] [month] [{Years}]", Scheduler.MonthlyRulesPriority)]
    // ReSharper disable once UnusedType.Global
    public class MiddleDayOfMonthScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public MiddleDayOfMonthScheduleRule()
        {
        }

        public MiddleDayOfMonthScheduleRule(MonthsOfYear monthsOfYear, int[] years)
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
            return $"Middle day Of {MonthsOfYear.ToEnumString()}{years}";
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            int daysInMonth = DateTime.DaysInMonth(timestamp.Year, timestamp.Month);

            int middleOfMonth = (daysInMonth) / 2;

            bool match = (MonthsOfYear.Has(timestamp.GetMonthOfYear()));
            match &= (timestamp.Day == middleOfMonth);
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