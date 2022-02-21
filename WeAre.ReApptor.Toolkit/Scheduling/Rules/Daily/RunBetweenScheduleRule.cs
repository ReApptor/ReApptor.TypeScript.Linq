using System;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;
using WeAre.ReApptor.Toolkit.Scheduling.Entities;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Daily
{
    [ScheduleRule(@"[Run] Between [{From:Time}] - [{To:Time}]", Scheduler.DailyRulesPriority, ConfigItemName = "Between")]
    public class RunBetweenScheduleRule : BaseScheduleRule
    {
        #region Private

        private CalendarTime _from;
        private CalendarTime _to;

        #endregion

        #region Constructors

        public RunBetweenScheduleRule()
        {
        }

        public RunBetweenScheduleRule(CalendarTime from, CalendarTime to)
        {
            From = from;
            To = to;
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            string script = $"Between {From} - {To}";
            return script;
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            bool match = (timestamp >= From) && (timestamp <= To);
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem(Mandatory = false)]
        public CalendarTime From
        {
            get { return _from ??= CalendarTime.First; }
            internal set { _from = value; }
        }

        [ScheduleConfigItem(Mandatory = false)]
        public CalendarTime To
        {
            get { return _to ??= CalendarTime.Last; }
            internal set { _to = value; }
        }

        #endregion
    }
}