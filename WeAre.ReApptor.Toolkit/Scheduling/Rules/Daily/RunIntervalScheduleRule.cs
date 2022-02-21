using System;
using System.Text;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;
using WeAre.ReApptor.Toolkit.Scheduling.Entities;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Daily
{
    [ScheduleRule(@"[Run] [With] Interval {Interval:Time} [From {From:Time}] [To {To:Time}]", Scheduler.DailyRulesPriority, ConfigItemName = "Interval")]
    public class RunIntervalScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public RunIntervalScheduleRule()
        {
        }

        public RunIntervalScheduleRule(CalendarTime time, CalendarTime from, CalendarTime to)
        {
            if (time == null)
                throw new ArgumentNullException(nameof(time));

            Interval = time;
            From = from;
            To = to;
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            var sb = new StringBuilder();
            sb.Append($"Run With Interval {Interval}");
            if (From != null)
            {
                sb.Append($" From {From}");
            }
            if (To != null)
            {
                sb.Append($" To {To}");
            }
            return sb.ToString();
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            int delayInMinutes = Interval.TotalMinutes;

            bool inverse = ((From != null) && (To != null) && (From > To));

            bool match = (inverse)
                ? (timestamp >= From) || (timestamp <= To)
                : ((From == null) || (timestamp >= From)) && ((To == null) || (timestamp <= To));

            if ((match) && (lastOccurence != null) && (lastOccurence.Value.Date == timestamp.Date))
            {
                DateTime indexBegins = ((From == null) || ((inverse) && (timestamp <= To)))
                    ? timestamp.Date
                    : timestamp.Date.AddMinutes(From.TotalMinutes);

                var lastIntervalIndex = (int)((lastOccurence.Value - indexBegins).TotalMinutes / delayInMinutes);
                var currentIntervalIndex = (int)((timestamp - indexBegins).TotalMinutes / delayInMinutes);

                match = (currentIntervalIndex > lastIntervalIndex);
            }

            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem(Mandatory = true, Default = "00:01", ConfigItemName = "ruleInterval")]
        public CalendarTime Interval { get; internal set; }

        [ScheduleConfigItem(ConfigItemName = "ruleFrom")]
        public CalendarTime From { get; internal set; }

        [ScheduleConfigItem(ConfigItemName = "ruleTo")]
        public CalendarTime To { get; internal set; }

        #endregion
    }
}