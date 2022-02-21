using System;
using System.Linq;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Monthly
{
    /// <summary>
    /// Specifies the "Monthly" rule, executes the schedule task based on selected day of week, week number and week interaction interval.
    /// Format: [{DaysNumbers}] [Of] {MonthsOfYear} [{Years}]
    /// </summary>
    /// <example>
    ///     "1-3, 5 January, March-May"                        - executes task on 1, 2, 3 and 5 of January, March, April and May
    ///     "1, 3, 5 January, February"                        - executes task on 1, 2 and 5 of January and February
    ///     "1, 3, 5 Any Month"                                - executes task on 1, 2 and 5 of any month
    /// </example>
    [ScheduleRule(@"{DaysNumbers} [Of] {MonthsOfYear} [month] [{Years}]", Scheduler.MonthlyRulesPriority)]
    public class MonthsOfYearScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public MonthsOfYearScheduleRule()
        {
        }

        public MonthsOfYearScheduleRule(MonthsOfYear monthsOfYear, int[] daysNumbers, int[] years)
        {
            MonthsOfYear = monthsOfYear;
            DaysNumbers = daysNumbers ?? new int[0];
            Years = years ?? new int[0];
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            string daysNumbers = (DaysNumbers.Length > 0)
                ? string.Join(", ", DaysNumbers.Select(number => number.ToString()))
                : "All";
            string years = (Years.Length > 0)
                ? " " + string.Join(", ", Years.Select(number => number.ToString()))
                : string.Empty;
            return $"{daysNumbers} Of {MonthsOfYear.ToEnumString()}{years}";
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            bool match = (MonthsOfYear.Has(timestamp.GetMonthOfYear()));
            match &= (DaysNumbers.Length == 0) || (DaysNumbers.Any(day => day == timestamp.Day));
            match &= (Years.Length == 0) || (Years.Any(year => year == timestamp.Year));
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public MonthsOfYear MonthsOfYear { get; internal set; }

        [ScheduleConfigItem]
        public int[] DaysNumbers { get; internal set; }

        [ScheduleConfigItem]
        public int[] Years { get; internal set; }

        #endregion
    }
}