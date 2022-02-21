using System;
using WeAre.ReApptor.Toolkit.Scheduling.Attributes;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules.Monthly
{
    [ScheduleRule(@"Add {DateIntervalValue} {DateIntervalType}", Scheduler.MonthlyRulesPriority)]
    public class DateIntervalScheduleRule : BaseScheduleRule
    {
        const int DaysPerWeek = 7;

        #region Constructors

        public DateIntervalScheduleRule()
        {
            DateIntervalValue = 1;
            DateIntervalType = DateInterval.Years;
        }

        public DateIntervalScheduleRule(int intervalValue, DateInterval intervalType)
        {
            DateIntervalValue = intervalValue;
            DateIntervalType = intervalType;
        }

        #endregion

        #region Methods

        public override string ToScript()
        {
            //return $"{MonthsInterval} Month";
            return null;
        }

        public override bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            if (!lastOccurence.HasValue)
            {
                throw new ArgumentNullException(nameof(lastOccurence), "For interval rules lastOccurence should be define");
            }

            switch (DateIntervalType)
            {
                case DateInterval.Days:
                    return timestamp >= lastOccurence.Value.AddDays(DateIntervalValue);

                case DateInterval.Weeks:
                    return timestamp >= lastOccurence.Value.AddDays(DaysPerWeek * DateIntervalValue);

                case DateInterval.Months:
                    return timestamp >= lastOccurence.Value.AddMonths(DateIntervalValue);

                case DateInterval.Years:
                    return timestamp >= lastOccurence.Value.AddYears(DateIntervalValue);
            }

            return false;
        }

        #endregion

        #region Properties

        [ScheduleConfigItem]
        public DateInterval DateIntervalType { get; internal set; }

        [ScheduleConfigItem]
        public int DateIntervalValue { get; internal set; }

        #endregion
    }
}