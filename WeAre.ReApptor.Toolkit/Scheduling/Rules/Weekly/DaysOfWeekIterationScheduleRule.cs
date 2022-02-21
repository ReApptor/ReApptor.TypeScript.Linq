using System;
using System.Text;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Weekly
{
    /// <summary>
    /// Specifies the "Weekly" rule, executes the schedule task based on selected day of week and week interaction interval.
    /// Long format:  [{DaysOfWeek}] x {WeeksInterval} [Weeks]
    /// Short format: [{DaysOfWeek}] Every {WeeksInterval} [Weeks]
    /// </summary>
    /// <example>
    ///     "Monday, Wednesday Every 2 Weeks"   - executes task on every second Monday and Wednesday (started from first occurrence or defined in other rules period)
    ///         "Monday, Wednesday x2"
    ///         "1, 3 x2"
    ///         "1, 3 x 2"
    ///     "5x3"                                   - executes task on each third Friday each third week (started from first occurrence or defined in other rules period)
    ///         "Friday Every 3 Weeks"
    ///         "5 x 3"
    ///         "5x 3"
    ///         "5 x3"
    ///     "x3"                                    - executes task on each day each third week (started from first occurrence or defined in other rules period)
    ///         "All x3"                            
    ///         "All x 3"
    ///         "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday x3"
    /// </example>
    [ScheduleRule(@"[{DaysOfWeek}] Every {WeeksInterval} [Weeks]", Scheduler.WeeklyRulesPriority)]
    public class DaysOfWeekIterationScheduleRule : BaseScheduleRule
    {
        #region Protected

        protected override string Preparse(string config)
        {
            return config.Replace("x", " Every ");
        }

        #endregion

        #region Constructors

        public DaysOfWeekIterationScheduleRule()
        {
        }

        public DaysOfWeekIterationScheduleRule(DaysOfWeek daysOfWeek, int weeksInterval)
        {
            DaysOfWeek = daysOfWeek;
            WeeksInterval = weeksInterval;
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
            sb.Append($" Every {WeeksInterval} Weeks");
            return sb.ToString();
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            DaysOfWeek daysOfWeek = DaysOfWeek;
            int weekIterationInterval = WeeksInterval;
            bool match = (daysOfWeek.Has(timestamp.DayOfWeek));
            if ((match) && (weekIterationInterval > 1))
            {
                if (lastOccurence != null)
                {
                    DateTime firstDayOfWeekOfLastOccurence = lastOccurence.Value.GetFirstDayOfWeek();
                    int weekIndex = timestamp.GetWeekIndex(firstDayOfWeekOfLastOccurence);
                    match = (weekIndex%weekIterationInterval == 0);
                }
            }
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public DaysOfWeek DaysOfWeek { get; internal set; }

        [ScheduleConfigItem]
        public int WeeksInterval { get; internal set; }

        #endregion
    }
}