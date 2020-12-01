using System;
using WeAre.Athenaeum.Toolkit.Scheduling.Attributes;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Rules.Weekly
{
    /// <summary>
    /// Specifies the rule, which execute the schedule task based on the first days of the week in month.
    /// Format: First [{DaysOfWeek}] [Of Month]
    /// </summary>
    /// <example>
    ///     "First Friday Of Month"                  - executes task on first Friday of month
    ///         "First Friday"
    ///         "First 5 Of Month"
    ///         "First 5"
    ///     "First All Of Month"                     - executes task on each day of first week of month
    ///         "First All"
    ///         "First Of Month"
    ///         "First"
    ///         "First Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Of Month"
    ///         "First Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
    ///         "First 0, 1, 2, 3, 4, 5, 6 Of Month"
    ///         "First 0, 1, 2, 3, 4, 5, 6"
    ///     "First Sunday, Monday Of Month"          - executes task on Sunday and Monday of first week of month
    ///         "First Sunday, Monday"
    ///         "First 0, 1 Of Month"
    ///         "First 0, 1"
    /// </example>
    [ScheduleRule(@"First [{DaysOfWeek}] [Of Month]", Scheduler.WeeklyRulesPriority)]
    public class FirstDaysOfWeekScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public FirstDaysOfWeekScheduleRule()
        {
        }

        public FirstDaysOfWeekScheduleRule(DaysOfWeek daysOfWeek)
        {
            DaysOfWeek = daysOfWeek;
        }

        #endregion

        #region Methods

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            DaysOfWeek daysOfWeek = DaysOfWeek;
            bool match = (daysOfWeek.Has(timestamp.DayOfWeek)) && (timestamp.IsFirstDayOfWeekOfMonth());
            return match;
        }

        public override string ToScript()
        {
            return (DaysOfWeek != DaysOfWeek.None)
                ? $"First {DaysOfWeek.ToEnumString()} Of Month"
                : null;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public DaysOfWeek DaysOfWeek { get; internal set; }

        #endregion
    }
}