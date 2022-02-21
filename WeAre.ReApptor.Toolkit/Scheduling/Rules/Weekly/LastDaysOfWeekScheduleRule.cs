using System;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Weekly
{
    /// <summary>
    /// Specifies the rule, which execute the schedule task based on the last days of the week in month.
    /// Format: Last [[DaysOfWeek]] [Of Month]
    /// </summary>
    /// <example>
    ///     "Last Friday Of Month"                  - executes task on last Friday of month
    ///         "Last Friday"
    ///         "Last 5 Of Month"
    ///         "Last 5"
    ///     "Last All Of Month"                     - executes task on each day of last week of month
    ///         "Last All"
    ///         "Last Of Month"
    ///         "Last"
    ///         "Last Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Of Month"
    ///         "Last Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
    ///         "Last 0, 1, 2, 3, 4, 5, 6 Of Month"
    ///         "Last 0, 1, 2, 3, 4, 5, 6"
    ///     "Last Sunday, Monday Of Month"          - executes task on Sunday and Monday of last week of month
    ///         "Last Sunday, Monday"
    ///         "Last 0, 1 Of Month"
    ///         "Last 0, 1"
    /// </example>
    [ScheduleRule(@"Last [{DaysOfWeek}] [Of Month]", Scheduler.WeeklyRulesPriority)]
    public class LastDaysOfWeekScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public LastDaysOfWeekScheduleRule()
        {
        }

        public LastDaysOfWeekScheduleRule(DaysOfWeek daysOfWeek)
        {
            DaysOfWeek = daysOfWeek;
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            return (DaysOfWeek != DaysOfWeek.None)
                ? $"Last {DaysOfWeek.ToEnumString()} Of Month"
                : null;
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            DaysOfWeek daysOfWeek = DaysOfWeek;
            bool match = (daysOfWeek.Has(timestamp.DayOfWeek)) && (timestamp.IsLastDayOfWeekOfMonth());
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public DaysOfWeek DaysOfWeek { get; internal set; }

        #endregion
    }
}