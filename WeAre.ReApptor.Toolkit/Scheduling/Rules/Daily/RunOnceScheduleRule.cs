using System;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;
using WeAre.ReApptor.Toolkit.Scheduling.Entities;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Daily
{
    [ScheduleRule(@"[Run] Once [At] {Interval:Time}", Scheduler.DailyRulesPriority, ConfigItemName = "Once")]
    public class RunOnceScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public RunOnceScheduleRule()
        {
        }

        public RunOnceScheduleRule(CalendarTime interval)
        {
            if (interval == null)
                throw new ArgumentNullException(nameof(interval));

            Interval = interval;
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            return $"Run Once At {Interval}";
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            bool match = (timestamp >= Interval);
            match &= (lastOccurence == null) || (lastOccurence.Value.Date != timestamp.Date) || (lastOccurence.Value < Interval);
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem(Mandatory = true, Default = "01:00", ConfigItemName = "ruleInterval")]
        public CalendarTime Interval { get; internal set; }

        #endregion
    }
}