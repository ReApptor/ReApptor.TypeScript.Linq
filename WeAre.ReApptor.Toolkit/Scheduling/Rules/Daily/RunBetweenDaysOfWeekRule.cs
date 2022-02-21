using System;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;
using WeAre.ReApptor.Toolkit.Scheduling.Entities;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Daily
{
    [ScheduleRule(@"[Run] Between {DayOfWeekFrom:DayOfWeek} {TimeFrom:Time} - {DayOfWeekTo:DayOfWeek} {TimeTo:Time}", Scheduler.DailyRulesPriority, ConfigItemName = "BetweenDaysOfWeek")]
    public class RunBetweenDaysOfWeekRule : BaseScheduleRule
    {
        #region Private

        private CalendarTime _timeFrom;
        private CalendarTime _timeTo;

        #endregion

        #region Constructors

        public RunBetweenDaysOfWeekRule()
        {
            DayOfWeekFrom = ScheduleHelper.GetFirstDayOfWeek();
            DayOfWeekTo = ScheduleHelper.GetLastDayOfWeek();
        }

        public RunBetweenDaysOfWeekRule(DayOfWeek dayOfWeekFrom, CalendarTime timeFrom, DayOfWeek dayOfWeekTo, CalendarTime timeTo)
        {
            if (timeFrom == null)
                throw new ArgumentNullException(nameof(timeFrom));
            if (timeFrom == null)
                throw new ArgumentNullException(nameof(timeTo));

            DayOfWeekFrom = dayOfWeekFrom;
            TimeFrom = timeFrom;
            DayOfWeekTo = dayOfWeekTo;
            TimeTo = timeTo;
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            string script = $"Between {DayOfWeekFrom} {TimeFrom} - {DayOfWeekTo} {TimeTo}";
            return script;
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            bool match = (timestamp.DayOfWeek >= DayOfWeekFrom) && (timestamp.DayOfWeek <= DayOfWeekTo);
            match &= (timestamp >= TimeFrom) && (timestamp <= TimeTo);
            return match;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem(Mandatory = true)]
        public DayOfWeek DayOfWeekFrom { get; internal set; }

        [ScheduleConfigItem(Mandatory = true)]
        public DayOfWeek DayOfWeekTo { get; internal set; }

        [ScheduleConfigItem(Mandatory = true)]
        public CalendarTime TimeFrom
        {
            get { return _timeFrom ??= CalendarTime.First; }
            internal set { _timeFrom = value; }
        }

        [ScheduleConfigItem(Mandatory = true)]
        public CalendarTime TimeTo
        {
            get { return _timeTo ??= CalendarTime.Last; }
            internal set { _timeTo = value; }
        }

        #endregion
    }
}