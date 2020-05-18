using System;

namespace Renta.Toolkit.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime ToLocal(this DateTime from, int? timezoneOffset = null)
        {
            return Utility.ToLocal(from, timezoneOffset);
        }

        /// <summary>
        /// Takes only date, sets (does not convert) DateTimeKind as Uts   
        /// </summary>
        public static DateTime AsUtcDate(this DateTime from)
        {
            return new DateTime(from.Year, from.Month, from.Day, 0, 0, 0, DateTimeKind.Utc);
        }
        
        /// <summary>
        /// Sets (does not convert) DateTimeKind to Uts
        /// </summary>
        public static DateTime AsUtc(this DateTime from)
        {
            return (from.Kind != DateTimeKind.Utc)
                ? new DateTime(from.Ticks, DateTimeKind.Utc)
                : from;
        }
        
        /// <summary>
        /// Sets (does not convert) DateTimeKind to Local
        /// </summary>
        public static DateTime AsLocal(this DateTime from)
        {
            return (from.Kind != DateTimeKind.Local)
                ? new DateTime(from.Ticks, DateTimeKind.Local)
                : from;
        }
        
        public static DateTime FirstDayOfMonth(this DateTime value)
        {
            //return value.Date.AddDays(1 - value.Day);
            return new DateTime(value.Year, value.Month, 1, 0, 0, 0, value.Kind);
        }
        
        public static DateTime FirstDayOfNextMonth(this DateTime value)
        {
            return value.LastDayOfMonth().AddDays(1);
        }
        
        public static DateTime LastDayOfMonth(this DateTime value)
        {
            //return value.FirstDayOfMonth().AddMonths(1).AddDays(-1);
            return new DateTime(value.Year, value.Month, DateTime.DaysInMonth(value.Year, value.Month), 0, 0, 0, value.Kind);
        }

        public static bool IsDateOnly(this DateTime value)
        {
            return (value.Millisecond == 0) && (value.Second == 0) && (value.Minute == 0) && (value.Hour == 0);
        }
    }
}