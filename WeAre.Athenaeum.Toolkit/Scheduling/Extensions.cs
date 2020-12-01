using System;
using System.Linq;

namespace WeAre.Athenaeum.Toolkit.Scheduling
{
    public static class Extensions
    {
        #region DaysOfWeek Extensions

        public static DayOfWeek[] GetValues(this DaysOfWeek daysOfWeek)
        {
            Array values = Enum.GetValues(typeof(DayOfWeek));
            return values.Cast<DayOfWeek>().Where(dayOfWeek => daysOfWeek.Has(dayOfWeek)).ToArray();
        }

        public static bool HasFlag(this DaysOfWeek daysOfWeek, DayOfWeek dayOfWeek)
        {
            return daysOfWeek.Has(dayOfWeek);
        }

        public static bool Has(this DaysOfWeek daysOfWeek, DayOfWeek dayOfWeek)
        {
            int value = (int) Convert(dayOfWeek);
            return (((int) daysOfWeek & value) == value);
        }

        public static DaysOfWeek Add(this DaysOfWeek daysOfWeek, DayOfWeek dayOfWeek)
        {
            int value = (int) Convert(dayOfWeek);
            return (DaysOfWeek) ((int) daysOfWeek | value);
        }

        public static DaysOfWeek Sub(this DaysOfWeek daysOfWeek, DayOfWeek dayOfWeek)
        {
            int value = (int) Convert(dayOfWeek);
            return (DaysOfWeek) ((int) daysOfWeek & ~value);
        }

        public static DaysOfWeek Convert(this DayOfWeek dayOfWeek)
        {
            return (DaysOfWeek) (1 << (int) dayOfWeek);
        }

        public static string ToEnumString(this DaysOfWeek daysOfWeek)
        {
            if (daysOfWeek == DaysOfWeek.All)
            {
                return nameof(DaysOfWeek.All);
            }

            if (daysOfWeek == DaysOfWeek.None)
            {
                return string.Empty;
            }

            DayOfWeek[] values = daysOfWeek.GetValues();
            return string.Join(", ", values);
        }

        #endregion

        #region MonthsOfYear Extensions

        public static MonthOfYear[] GetValues(this MonthsOfYear monthsOfYear)
        {
            Array values = Enum.GetValues(typeof(MonthOfYear));
            return values.Cast<MonthOfYear>().Where(monthOfYear => monthsOfYear.Has(monthOfYear)).ToArray();
        }

        public static bool HasFlag(this MonthsOfYear monthsOfYear, MonthOfYear monthOfYear)
        {
            return monthsOfYear.Has(monthOfYear);
        }

        public static bool Has(this MonthsOfYear monthsOfYear, MonthOfYear monthOfYear)
        {
            int value = (int) Convert(monthOfYear);
            return (((int) monthsOfYear & value) == value);
        }

        public static bool Has(this MonthsOfYear monthsOfYear, int month)
        {
            MonthOfYear monthOfYear = (MonthOfYear) (month - 1);
            int value = (int) Convert(monthOfYear);
            return (((int) monthsOfYear & value) == value);
        }

        public static MonthsOfYear Add(this MonthsOfYear monthsOfYear, MonthOfYear monthOfYear)
        {
            int value = (int) Convert(monthOfYear);
            return (MonthsOfYear) ((int) monthsOfYear | value);
        }

        public static MonthsOfYear Sub(this MonthsOfYear monthsOfYear, MonthOfYear monthOfYear)
        {
            int value = (int) Convert(monthOfYear);
            return (MonthsOfYear) ((int) monthsOfYear & ~value);
        }

        public static MonthsOfYear Convert(this MonthOfYear monthOfYear)
        {
            return (MonthsOfYear) (1 << (int) monthOfYear);
        }

        public static string ToEnumString(this MonthsOfYear monthsOfYear)
        {
            if (monthsOfYear == MonthsOfYear.All)
            {
                return nameof(MonthsOfYear.All);
            }

            if (monthsOfYear == MonthsOfYear.None)
            {
                return string.Empty;
            }

            MonthOfYear[] values = monthsOfYear.GetValues();
            return string.Join(", ", values);
        }

        #endregion

        #region String Extensions

        public static bool TryParse(this string value, out DaysOfWeek daysOfWeek, string[] separators = null)
        {
            daysOfWeek = DaysOfWeek.None;
            separators ??= new[] {" ", ",", ";", "|", "\r\n", "\n"};
            value ??= string.Empty;
            string[] items = value.Split(separators, StringSplitOptions.RemoveEmptyEntries);
            if ((items.Length == 0) || ((items.Length == 1) && (string.Compare(items[0], DaysOfWeek.None.ToString(), StringComparison.InvariantCultureIgnoreCase) == 0)))
            {
                return true;
            }

            foreach (string dayOfWeekValue in items)
            {
                DayOfWeek dayOfWeek;
                if (!Enum.TryParse(dayOfWeekValue, out dayOfWeek))
                {
                    return false;
                }

                daysOfWeek.Add(dayOfWeek);
            }

            return true;
        }

        public static DaysOfWeek ToDaysOfWeek(this string value, string[] separators = null)
        {
            if (!TryParse(value, out DaysOfWeek daysOfWeek, separators))
                throw new ArgumentOutOfRangeException(nameof(value), $"Invalid list of days of week \"{value}\".");

            return daysOfWeek;
        }

        #endregion
    }
}