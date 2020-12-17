using System;
using System.Collections.Generic;
using System.Globalization;

namespace WeAre.Athenaeum.Toolkit.Scheduling
{
    public static class ScheduleHelper
    {
        #region Helpers

        public static TimeZoneInfo FetchCountryTimeZone(string countryCode)
        {
            if ((!string.IsNullOrWhiteSpace(countryCode)) &&
                (!countryCode.Equals("utc", StringComparison.InvariantCultureIgnoreCase)) &&
                (!countryCode.Equals("undefined", StringComparison.InvariantCultureIgnoreCase)))
            {
                countryCode = countryCode.ToLowerInvariant();

                switch (countryCode)
                {
                    case "se":
                    case "sv-se":
                    case "no":
                    case "nb":
                    case "nb-no":
                    case "nn-no":
                    case "nor":
                    case "pl":
                    case "pl-pl":
                        //Sweden, Norway, Poland
                        return Utility.GetTimeZone("Europe/Stockholm", "W. Europe Standard Time");

                    case "ee":
                    case "et-ee":
                    case "fi":
                    case "fi-fi":
                    case "sv-fi":
                        //Estonia, Finland
                        return Utility.GetTimeZone("Europe/Helsinki", "FLE Standard Time");
                }

                throw new ArgumentOutOfRangeException($"Time zone for country \"{countryCode}\" cannot be fetched.");
            }

            return null;
        }

        public static DayOfWeek GetFirstDayOfWeek()
        {
            return CultureInfo.CurrentCulture.DateTimeFormat.FirstDayOfWeek;
        }

        public static DayOfWeek GetLastDayOfWeek()
        {
            int first = (int) GetFirstDayOfWeek();
            int last = first + 6;
            if (last > 6)
            {
                last = last - 6;
            }

            return (DayOfWeek) last;
        }

        #endregion

        #region DateTime Extensions

        public static int GetLastDayOfMonth(this DateTime timestamp)
        {
            DateTime date = timestamp.Date;
            DateTime firstDay = new DateTime(date.Year, date.Month, 1);
            DateTime nextMonth = firstDay.AddMonths(1);
            DateTime lastDayOfMonth = nextMonth.AddDays(-1);
            return lastDayOfMonth.Day;
        }

        public static int[] GetWeeksOfMonthDates(this DateTime timestamp)
        {
            DateTime date = timestamp.Date;
            int month = date.Month;
            DateTime firstDay = new DateTime(date.Year, month, 1);
            var weeks = new List<int>();
            int weekNumber = 1;
            DayOfWeek firstDayOfWeek = GetFirstDayOfWeek();
            while (true)
            {
                if ((firstDay.DayOfWeek == firstDayOfWeek) && (firstDay.Day != 1))
                {
                    weekNumber++;
                }

                weeks.Add(weekNumber);
                firstDay = firstDay.AddDays(1);
                if (firstDay.Month != month)
                {
                    break;
                }
            }

            return weeks.ToArray();
        }

        public static int GetWeekOfMonth(this DateTime timestamp)
        {
            int[] weeks = GetWeeksOfMonthDates(timestamp);
            int day = timestamp.Day;
            return weeks[day - 1];
        }

        /// <summary>
        /// Returns the number of full weeks passed from the start date until the current timestamp (starts from 0)
        /// </summary>
        public static int GetWeekIndex(this DateTime timestamp, DateTime start)
        {
            DateTime startDate = start.Date;
            DateTime date = timestamp.Date;
            if (startDate > date)
                throw new ArgumentOutOfRangeException(nameof(start), $"Start date \"{startDate}\" should be less then timestamp date \"{date}\".");

            TimeSpan different = (date - startDate);
            int weekIndex = different.Days / 7;
            return weekIndex;
        }

        public static DateTime GetFirstDayOfWeek(this DateTime timestamp)
        {
            DayOfWeek firstDayOfWeek = GetFirstDayOfWeek();
            while (timestamp.DayOfWeek != firstDayOfWeek)
            {
                timestamp = timestamp.AddDays(-1);
            }

            return timestamp;
        }

        /// <summary>
        /// Returns the number of months passed from the start date until the current timestamp, starts from 1
        /// </summary>
        public static int GeMonthIndex(this DateTime timestamp, DateTime start)
        {
            DateTime startDate = start.Date;
            DateTime date = timestamp.Date;
            if (startDate > date)
                throw new ArgumentOutOfRangeException(nameof(start), $"Start date \"{startDate}\" should be less then timestamp date \"{date}\".");

            int months = 0;
            while (startDate < date)
            {
                months++;
                startDate = startDate.AddMonths(1);
            }

            return months;
        }

        public static MonthOfYear GetMonthOfYear(this DateTime timestamp)
        {
            return (MonthOfYear) (timestamp.Month - 1);
        }

        public static bool IsLastDayOfWeekOfYear(this DateTime timestamp)
        {
            DateTime date = timestamp.Date;
            int year = date.Year;
            DateTime nextWeek = date.AddDays(7);
            int nextWeekYear = nextWeek.Year;
            return (year != nextWeekYear);
        }

        public static bool IsLastWeekOfMonth(this DateTime timestamp)
        {
            int[] weeks = GetWeeksOfMonthDates(timestamp);
            int day = timestamp.Day;
            int weekNumber = weeks[day];
            int lastWeekNumber = weeks[^1];
            return (weekNumber == lastWeekNumber);
        }

        public static bool IsLastDayOfMonth(this DateTime timestamp)
        {
            DateTime date = timestamp.Date;
            int month = date.Month;
            DateTime nextDay = date.AddDays(1);
            int nextDayMonth = nextDay.Month;
            return (month != nextDayMonth);
        }

        public static bool IsFirstDayOfWeekOfMonth(this DateTime timestamp)
        {
            DateTime date = timestamp.Date;
            int month = date.Month;
            DateTime previousWeek = date.AddDays(-7);
            int previousWeekMonth = previousWeek.Month;
            return (month != previousWeekMonth);
        }

        public static bool IsWorkingDay(this DateTime timestamp)
        {
            return (timestamp.DayOfWeek >= DayOfWeek.Monday) && (timestamp.DayOfWeek <= DayOfWeek.Friday);
        }

        public static DateTime GetFirstWorkingDayOfMonthDay(this DateTime timestamp)
        {
            var day = new DateTime(timestamp.Year, timestamp.Month, 1);
            
            while (!day.IsWorkingDay())
            {
                day = day.AddDays(1);
            }

            return day;
        }

        public static DateTime GetLastWorkingDayOfMonthDay(this DateTime timestamp)
        {
            var day = new DateTime(timestamp.Year, timestamp.Month, timestamp.GetLastDayOfMonth());
            
            while (!day.IsWorkingDay())
            {
                day = day.AddDays(-1);
            }

            return day;
        }

        public static bool IsFirstWorkingDayOfMonth(this DateTime timestamp)
        {
            DateTime firstWorkingDayOfMonth = GetFirstWorkingDayOfMonthDay(timestamp);
            return (timestamp.Day == firstWorkingDayOfMonth.Day);
        }

        public static bool IsLastWorkingDayOfMonth(this DateTime timestamp)
        {
            DateTime lastWorkingDayOfMonth = GetLastWorkingDayOfMonthDay(timestamp);
            return (timestamp.Day == lastWorkingDayOfMonth.Day);
        }

        public static bool IsLastDayOfWeekOfMonth(this DateTime timestamp)
        {
            DateTime date = timestamp.Date;
            int month = date.Month;
            DateTime nextWeek = date.AddDays(7);
            int nextWeekMonth = nextWeek.Month;
            return (month != nextWeekMonth);
        }

        #endregion
    }
}