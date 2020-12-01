using System;
using WeAre.Athenaeum.Toolkit.Scheduling.Attributes;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Rules.Weekly
{
    /// <summary>
    /// Specifies the rule, which execute the schedule task based on the days of week of last week of month
    /// Format: [DaysOfWeek] Last Week
    /// </summary>
    /// <example>
    ///     "Thursday, Friday Last Week"    - executes task on Thursday and Friday of last week of month
    ///         "4, 5 Last Week"
    ///     "All Last Week"                 - executes task on each day of last week of month
    ///         "Last Week"
    ///         "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Last Week"
    ///         "0, 1, 2, 3, 4, 5, 6 Last Week"
    /// </example>
    [ScheduleRule(@"[{DaysOfWeek}] Last Week", Scheduler.WeeklyRulesPriority)]
    public class LastWeekOfMonthScheduleRule : BaseScheduleRule
    {
        public LastWeekOfMonthScheduleRule()
        {
        }

        public LastWeekOfMonthScheduleRule(DaysOfWeek daysOfWeek)
        {
            DaysOfWeek = daysOfWeek;
        }

        public override string ToScript()
        {
            return (DaysOfWeek != DaysOfWeek.None)
                ? $"{DaysOfWeek.ToEnumString()} Last Week"
                : null;
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            DaysOfWeek daysOfWeek = DaysOfWeek;
            bool match = (daysOfWeek.Has(timestamp.DayOfWeek)) && (timestamp.IsLastWeekOfMonth());
            return match;
        }

        [ScheduleConfigItem]
        public DaysOfWeek DaysOfWeek { get; internal set; }
    }
}