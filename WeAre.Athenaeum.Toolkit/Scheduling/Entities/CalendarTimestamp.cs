using System;
using WeAre.Athenaeum.Toolkit.Scheduling.Rules;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Entities
{
    /// <summary>
    /// Specifies the date (calendar timestamp) in following formats:
    /// - DD.MM.YY
    /// - DD.MM.YYYY
    /// - MM.YY
    /// - MM.YYYY
    /// - DD.MM.YYYY
    /// - MM.YY
    /// - MM.YYYY
    /// - DD Month YY
    /// - DD Month YYYY
    /// Any part can be unspecified, for example:
    /// - **.03.2015 (*.03.2015, DD.03.2015, D.03.2015)
    /// - **.**.2015 (*.*.2015, DD.MM.2015, D.M.2015, 2015)
    /// - January 2015
    /// - January
    /// - etc...
    /// </summary>
    public sealed class CalendarTimestamp : IEquatable<CalendarTimestamp>, IComparable<CalendarTimestamp>, IComparable<DateTime>
    {
        private bool TryParseDay(string day, out byte? value)
        {
            day = (day ?? string.Empty).Trim();
            value = null;
            if ((string.Compare(day, "DD", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(day, "**", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(day, "*", StringComparison.InvariantCultureIgnoreCase) == 0))
            {
                return true;
            }
            if ((byte.TryParse(day, out byte byteValue)) && (byteValue >= 1) && (byteValue <= 31))
            {
                value = byteValue;
                return true;
            }
            return false;
        }

        private bool TryParseMonth(string s, bool extendedOnly, out MonthOfYear? value)
        {
            s = (s ?? string.Empty).Trim();
            value = null;
            if (!extendedOnly)
            {
                if ((string.Compare(s, "**", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                    (string.Compare(s, "*", StringComparison.InvariantCultureIgnoreCase) == 0))
                {
                    return true;
                }
            }
            bool isNumber = false;
            if (int.TryParse(s, out int intValue))
            {
                isNumber = true;
                if ((!extendedOnly) && (intValue >= 1) && (intValue <= 12))
                {
                    value = (MonthOfYear) (intValue - 1);
                    return true;
                }
            }
            if (string.Compare(s, "MM", StringComparison.InvariantCultureIgnoreCase) == 0)
            {
                return true;
            }
            if (Enum.TryParse(s, true, out MonthOfYear enumValue))
            {
                if ((!isNumber) || (!extendedOnly))
                {
                    value = enumValue;
                    return true;
                }
            }
            return false;
        }

        private bool TryParseYear(string s, bool extendedOnly, out int? value)
        {
            s = (s ?? string.Empty).Trim();
            value = null;
            if (!extendedOnly)
            {
                if (
                    (string.Compare(s, "**", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                    (string.Compare(s, "*", StringComparison.InvariantCultureIgnoreCase) == 0))
                {
                    return true;
                }
            }
            if ((string.Compare(s, "YY", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(s, "YYYY", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(s, "****", StringComparison.InvariantCultureIgnoreCase) == 0))
            {
                return true;
            }
            if (int.TryParse(s, out var intValue))
            {
                if ((!extendedOnly) && (intValue < 100))
                {
                    intValue += 2000;
                }
                if ((intValue >= ScheduleConfigParser.MinYearNumber) && (intValue <= ScheduleConfigParser.MaxYearNumber))
                {
                    value = intValue;
                    return true;
                }
            }
            return false;
        }

        private bool TryParse(string value, out string error)
        {
            error = null;

            if (string.IsNullOrWhiteSpace(value))
            {
                error = "Value is null or white space.";
                return false;
            }

            value = value.Trim();
            string[] items = value.Split(new[] { ".", "-", " " }, StringSplitOptions.RemoveEmptyEntries);

            byte? day = null;
            MonthOfYear? month = null;
            int? year = null;

            bool hasError;
            if (items.Length == 3)
            {
                hasError = (!TryParseDay(items[0], out day)) || (!TryParseMonth(items[1], false, out month)) || (!TryParseYear(items[2], false, out year));
            }
            else if (items.Length == 2)
            {
                bool success = 
                    ((TryParseMonth(items[0], true, out month)) && (TryParseYear(items[1], false, out year))) ||    //full month + year
                    ((TryParseMonth(items[0], false, out month)) && (TryParseYear(items[1], true, out year))) ||    //month + full year
                    ((TryParseDay(items[0], out day)) && (TryParseMonth(items[1], true, out month)));               //day + full month
                hasError = !success;
            }
            else if (items.Length == 1)
            {
                bool success =
                    (TryParseMonth(items[0], true, out month)) ||   //full year
                    (TryParseYear(items[0], true, out year)) ||     //full year
                    (TryParseDay(items[0], out day));               //day
                hasError = !success;
            }
            else
            {
                hasError = true;
            }

            if (hasError)
            {
                error = $"Invalid timestamp format exception \"{value}\"";
                return false;
            }

            Day = day;
            Month = month;
            Year = year;
            return true;
        }

        public CalendarTimestamp()
        {
        }

        public CalendarTimestamp(string value)
        {
            if (!TryParse(value, out string error))
            {
                throw new ArgumentNullException(nameof(value), error);
            }
        }

        public CalendarTimestamp(byte? day, MonthOfYear? month, int? year)
        {
            Day = day;
            Month = month;
            Year = year;
        }

        public CalendarTimestamp(DateTime timestamp)
            : this((byte)timestamp.Day, timestamp.GetMonthOfYear(), timestamp.Year)
        {
        }

        public bool CanBeCompared(CalendarTimestamp other)
        {
            if (ReferenceEquals(other, null))
            {
                return false;
            }
            bool canBeCompared = ((Year == null) && (other.Year == null)) || ((Year != null) && (other.Year != null));
            canBeCompared &= ((Month == null) && (other.Month == null)) || ((Month != null) && (other.Month != null));
            canBeCompared &= ((Day == null) && (other.Day == null)) || ((Day != null) && (other.Day != null));
            return canBeCompared;
        }

        public int CompareTo(CalendarTimestamp other)
        {
            if (!CanBeCompared(other))
                throw new ArgumentOutOfRangeException(nameof(other), "The instances cannot be compared.");

            if (Year != null)
            {
                if (Year > other.Year)
                {
                    return 1;
                }
                if (Year < other.Year)
                {
                    return -1;
                }
            }

            if (Month != null)
            {
                if (Month > other.Month)
                {
                    return 1;
                }
                if (Month < other.Month)
                {
                    return -1;
                }
            }

            if (Day != null)
            {
                if (Day > other.Day)
                {
                    return 1;
                }
                if (Day < other.Day)
                {
                    return -1;
                }
            }

            return 0;
        }

        public int CompareTo(DateTime other)
        {
            byte? day = (Day != null) ? (byte)other.Day : (byte?)null;
            MonthOfYear? month = (Month != null) ? other.GetMonthOfYear() : (MonthOfYear?)null;
            int? year = (Year != null) ? other.Year : (int?)null;
            CalendarTimestamp timestamp = new CalendarTimestamp(day, month, year);
            return CompareTo(timestamp);
        }

        public bool Equals(CalendarTimestamp other)
        {
            if (ReferenceEquals(null, other))
            {
                return false;
            }
            if (ReferenceEquals(this, other))
            {
                return true;
            }
            return ((Day == other.Day) && (Month == other.Month) && (Year == other.Year));
        }

        public override bool Equals(object other)
        {
            return Equals(other as CalendarTimestamp);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = Day.GetHashCode();
                hashCode = (hashCode * 397) ^ Month.GetHashCode();
                hashCode = (hashCode * 397) ^ Year.GetHashCode();
                return hashCode;
            }
        }

        public override string ToString()
        {
            string day = (Day != null) ? $"{Day:00}" : string.Empty;
            string month = (Month != null) ? $"{Month}" : string.Empty;
            string year = (Year != null) ? $"{Year}" : string.Empty;
            return $"{day} {month} {year}".Trim();
        }

        public bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            MonthOfYear month = timestamp.GetMonthOfYear();
            bool match = ((Year == null) || (Year == timestamp.Year));
            match &= (Month == null) || (Month == month);
            match &= (Day == null) || (Day == timestamp.Day);
            return match;
        }

        public static bool TryParse(string s, out CalendarTimestamp timestamp, out string error)
        {
            timestamp = new CalendarTimestamp();
            return timestamp.TryParse(s, out error);
        }

        public static bool TryParse(string s, out CalendarTimestamp timestamp)
        {
            timestamp = new CalendarTimestamp();
            return timestamp.TryParse(s, out _);
        }

        public static bool operator ==(CalendarTimestamp x, CalendarTimestamp y)
        {
            if (ReferenceEquals(x, y))
            {
                return true;
            }
            if (ReferenceEquals(x, null))
            {
                return false;
            }
            return (x.Equals(y));
        }

        public static bool operator !=(CalendarTimestamp x, CalendarTimestamp y)
        {
            return !(x == y);
        }

        public byte? Day { get; private set; }

        public MonthOfYear? Month { get; private set; }

        public int? Year { get; private set; }
    }
}