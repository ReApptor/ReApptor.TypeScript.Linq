using System;
using WeAre.Athenaeum.Toolkit.Scheduling.Attributes;
using WeAre.Athenaeum.Toolkit.Scheduling.Entities;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Rules.Monthly
{
    [ScheduleRule(Scheduler.MonthlyRulesPriority)]
    public class CalendarTimestampScheduleRule : BaseScheduleRule
    {
        #region Constructors

        public CalendarTimestampScheduleRule()
        {
        }

        public CalendarTimestampScheduleRule(CalendarTimestamp value)
        {
            CalendarTimestamp = value ?? new CalendarTimestamp();
        }

        public CalendarTimestampScheduleRule(byte? day, MonthOfYear? month, int? year)
        {
            CalendarTimestamp = new CalendarTimestamp(day, month, year);
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            return CalendarTimestamp.ToString();
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            return CalendarTimestamp.Match(timestamp, lastOccurence);
        }

        public override void FromScript(string config)
        {
            CalendarTimestamp = new CalendarTimestamp(config);
        }

        public override bool TryFromScript(string script, out string error)
        {
            CalendarTimestamp calendarTimestamp;
            bool parsed = CalendarTimestamp.TryParse(script, out calendarTimestamp, out error);
            CalendarTimestamp = calendarTimestamp;
            return parsed;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public CalendarTimestamp CalendarTimestamp { get; internal set; }

        #endregion
    }
}