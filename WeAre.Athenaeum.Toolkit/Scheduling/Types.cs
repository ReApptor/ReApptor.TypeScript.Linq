using System;
using System.Runtime.Serialization;

namespace WeAre.Athenaeum.Toolkit.Scheduling
{
    /// <summary>
    /// Set of days of week
    /// </summary>
    [Flags]
    [Serializable]
    [DataContract]
    public enum DaysOfWeek
    {
        None = 0,

        Sunday = 1 << DayOfWeek.Sunday,

        Monday = 1 << DayOfWeek.Monday,

        Tuesday = 1 << DayOfWeek.Tuesday,

        Wednesday = 1 << DayOfWeek.Wednesday,

        Thursday = 1 << DayOfWeek.Thursday,

        Friday = 1 << DayOfWeek.Friday,

        Saturday = 1 << DayOfWeek.Saturday,

        All = Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday
    }

    /// <summary>
    /// Month of year ([0..11])
    /// </summary>
    [Serializable]
    [DataContract]
    public enum MonthOfYear
    {
        January = 0,

        February = 1,

        March = 2,

        April = 3,

        May = 4,

        June = 5,

        July = 6,

        August = 7,

        September = 8,

        October = 9,

        November = 10,

        December = 11,
    }

    /// <summary>
    /// Set of months of year 
    /// </summary>
    [Flags]
    [Serializable]
    [DataContract]
    public enum MonthsOfYear
    {
        None = 0,

        January = 1 << MonthOfYear.January,

        February = 1 << MonthOfYear.February,

        March = 1 << MonthOfYear.March,

        April = 1 << MonthOfYear.April,

        May = 1 << MonthOfYear.May,

        June = 1 << MonthOfYear.June,

        July = 1 << MonthOfYear.July,

        August = 1 << MonthOfYear.August,

        September = 1 << MonthOfYear.September,

        October = 1 << MonthOfYear.October,

        November = 1 << MonthOfYear.November,

        December = 1 << MonthOfYear.December,

        All = January | February | March | April | May | June | July | August | September | October | November | December
    }

    [Flags]
    [Serializable]
    [DataContract]
    public enum DateInterval
    {
        Days = 0,

        Weeks = 1,

        Months = 2,

        Years = 3,
    }
}