using System;
using WeAre.Athenaeum.Toolkit.Scheduling.Attributes;
using WeAre.Athenaeum.Toolkit.Scheduling.Entities;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Rules.Monthly
{
    [ScheduleRule(Scheduler.MonthlyRulesPriority)]
    public class CalendarIntervalScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public CalendarIntervalScheduleRule()
        {
        }

        public CalendarIntervalScheduleRule(CalendarInterval value)
        {
            CalendarInterval = value ?? ScheduleConfigParser.DefaultCalendarInterval;
        }

        public CalendarIntervalScheduleRule(CalendarTimestamp from, CalendarTimestamp to)
        {
            CalendarInterval = new CalendarInterval(from, to);
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            return CalendarInterval.ToString();
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            return CalendarInterval.Match(timestamp, lastOccurence);
        }

        public override void FromScript(string config)
        {
            CalendarInterval = new CalendarInterval(config);
        }

        public override bool TryFromScript(string script, out string error)
        {
            bool parsed = CalendarInterval.TryParse(script, out CalendarInterval calendarInterval, out error);
            CalendarInterval = calendarInterval;
            return parsed;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public CalendarInterval CalendarInterval { get; internal set; }

        #endregion
    }
}