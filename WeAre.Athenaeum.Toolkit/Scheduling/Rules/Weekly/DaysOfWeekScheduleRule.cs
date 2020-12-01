using System;
using System.Linq;
using System.Text;
using WeAre.Athenaeum.Toolkit.Scheduling.Attributes;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Rules.Weekly
{
    /// <summary>
    /// Specifies the "Weekly" rule, executes the schedule task based on selected day of week, week number and week interaction interval.
    /// Format: [{DaysOfWeek}] [Week {WeeksNumbers}]
    /// </summary>
    /// <example>
    ///     "Monday"                        - executes task on each Monday
    ///         "1"
    ///     "Monday, Thursday"              - executes task on each Monday and Thursday
    ///         "1, 4"
    ///     "All"                           - executes task on each Monday and Friday
    ///         "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
    ///         "0, 1, 2, 3, 4, 5, 6"
    ///     "Sunday Week 1"                 - executes task on Sunday of first week of month (week starts from Sunday)
    ///         "0 Week 1"
    ///     "Sunday, Monday Week 2"         - executes task on Sunday and Monday of second week of month (week starts from Sunday)
    ///         "0, 1 Week 2"
    ///     "Sunday, Monday Week 2, 4"      - executes task on Sunday and Monday of second and forth week of month (week starts from Sunday)
    ///         "0, 1 Week 2, 4"
    ///     "All Week 1"                    - executes task on each day of first week of month (week starts from Sunday)
    ///         "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday Week 1"
    ///         "0, 1, 2, 3, 4, 5, 6 Week 1"
    ///         "Week 1"
    /// </example>
    [ScheduleRule(@"[{DaysOfWeek}] [Week {WeeksNumbers}]", Scheduler.WeeklyRulesPriority)]
    public class DaysOfWeekScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public DaysOfWeekScheduleRule()
        {
        }

        public DaysOfWeekScheduleRule(DaysOfWeek daysOfWeek, int[] weeksNumbers = null)
        {
            DaysOfWeek = daysOfWeek;
            WeeksNumbers = weeksNumbers ?? new int[0];
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            var sb = new StringBuilder();
            if (DaysOfWeek != DaysOfWeek.None)
            {
                sb.Append(DaysOfWeek.ToEnumString());
            }
            if (WeeksNumbers.Length > 0)
            {
                string weekNumbers = string.Join(", ", WeeksNumbers.Select(number => number.ToString()));
                sb.Append($" Week {weekNumbers}");
            }
            return sb.ToString();
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            DaysOfWeek daysOfWeek = DaysOfWeek;
            int[] weeksNumbers = WeeksNumbers;
            int weekOfMonth = timestamp.GetWeekOfMonth();
            bool match = (daysOfWeek.Has(timestamp.DayOfWeek));
            match &= (weeksNumbers.Length == 0) || (weeksNumbers.Any(week => week == weekOfMonth));
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public DaysOfWeek DaysOfWeek { get; internal set; }

        [ScheduleConfigItem]
        public int[] WeeksNumbers { get; internal set; }

        #endregion
    }
}