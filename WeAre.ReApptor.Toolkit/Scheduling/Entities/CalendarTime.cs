using System;

namespace WeAre.ReApptor.Toolkit.Scheduling.Entities
{
    /// <summary>
    /// Specifies the time (only hours and minute):
    /// - HH:MM
    /// - MM (hour = min/60, min = min - 60*hour)
    /// </summary>
    public sealed class CalendarTime : IEquatable<CalendarTime>, IComparable<CalendarTime>
    {
        private bool TryParseHour(string s, out byte value)
        {
            s = (s ?? string.Empty).Trim();
            value = 0;
            if ((string.Compare(s, "HH", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(s, "**", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(s, "*", StringComparison.InvariantCultureIgnoreCase) == 0))
            {
                return true;
            }
            byte byteValue;
            if ((byte.TryParse(s, out byteValue)) && (byteValue <= 24))
            {
                value = byteValue;
                return true;
            }
            return false;
        }

        private bool TryParseMinute(string s, bool limited, out byte value)
        {
            s = (s ?? string.Empty).Trim();
            value = 0;
            if ((string.Compare(s, "MM", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(s, "**", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                (string.Compare(s, "*", StringComparison.InvariantCultureIgnoreCase) == 0))
            {
                return true;
            }

            if ((byte.TryParse(s, out byte byteValue)) && ((!limited) || (byteValue <= 59)))
            {
                value = byteValue;
                return true;
            }
            return false;
        }

        private void Parse(string value)
        {
            if (value == null)
                throw new ArgumentNullException(nameof(value));
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentOutOfRangeException(nameof(value), "Value is null or white space.");

            value = value.Trim();
            string[] items = value.Split(new[] { ":", ".", "-", " " }, StringSplitOptions.RemoveEmptyEntries);

            byte hour = 0;
            byte min = 0;

            bool error;
            if ((items.Length == 3) || (items.Length == 2))
            {
                error = (!TryParseHour(items[0], out hour)) || (!TryParseMinute(items[1], true, out min));
            }
            else if (items.Length == 1)
            {
                error = (!TryParseMinute(items[0], false, out min));
                hour = (byte) (min/60);
                min = (byte)(min - 60*hour);
            }
            else
            {
                error = true;
            }

            if (error)
                throw new FormatException($"Invalid time format \"{value}\" (should be 'hh:mm' or 'hh').");

            Hour = hour;
            Min = min;
        }

        public CalendarTime()
        {
        }

        public CalendarTime(string value)
        {
            Parse(value);
        }

        public CalendarTime(byte hour, byte min)
        {
            if (hour > 23)
                throw new ArgumentOutOfRangeException(nameof(hour), $"Hour value \"{hour}\" is out of range [00..23].");
            if (min > 59)
                throw new ArgumentOutOfRangeException(nameof(min), $"Min value \"{min}\" is out of range [00..59].");

            Hour = hour;
            Min = min;
        }

        public CalendarTime(DateTime timestamp)
            : this((byte)timestamp.Hour, (byte)timestamp.Minute)
        {
        }

        public int CompareTo(CalendarTime other)
        {
            if (ReferenceEquals(other, null))
            {
                return 1;
            }

            if (Hour > other.Hour)
            {
                return 1;
            }
            if (Hour < other.Hour)
            {
                return -1;
            }

            if (Min > other.Min)
            {
                return 1;
            }
            if (Min < other.Min)
            {
                return -1;
            }

            return 0;
        }

        public int CompareTo(DateTime other)
        {
            var timestamp = new CalendarTime(other);
            return CompareTo(timestamp);
        }

        public bool Equals(CalendarTime other)
        {
            if (ReferenceEquals(null, other))
            {
                return false;
            }
            if (ReferenceEquals(this, other))
            {
                return true;
            }
            return ((Hour == other.Hour) && (Min == other.Min));
        }

        public override bool Equals(object other)
        {
            return Equals(other as CalendarTime);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = Hour.GetHashCode();
                hashCode = (hashCode * 397) ^ Min.GetHashCode();
                return hashCode;
            }
        }

        public override string ToString()
        {
            return $"{Hour:00}:{Min:00}";
        }

        public bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            bool match = (Hour == timestamp.Hour) && (Min == timestamp.Minute);
            return match;
        }

        public static bool TryParse(string s, out CalendarTime timestamp)
        {
            try
            {
                timestamp = new CalendarTime(s);
                return true;
            }
            catch (Exception)
            {
                timestamp = null;
                return false;
            }
        }

        public static bool operator ==(CalendarTime x, CalendarTime y)
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

        public static bool operator !=(CalendarTime x, CalendarTime y)
        {
            return !(x == y);
        }

        public static bool operator >=(CalendarTime x, CalendarTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) >= 0);
        }

        public static bool operator <=(CalendarTime x, CalendarTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) <= -1);
        }

        public static bool operator >=(CalendarTime x, DateTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) >= 0);
        }

        public static bool operator <=(CalendarTime x, DateTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) <= -1);
        }

        public static bool operator >=(DateTime x, CalendarTime y)
        {
            if (ReferenceEquals(y, null))
                throw new ArgumentNullException(nameof(y));

            return (y.CompareTo(x) <= 0);
        }

        public static bool operator <=(DateTime x, CalendarTime y)
        {
            if (ReferenceEquals(y, null))
                throw new ArgumentNullException(nameof(y));

            return (y.CompareTo(x) >= 0);
        }

        public static bool operator >(CalendarTime x, CalendarTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) > 0);
        }

        public static bool operator <(CalendarTime x, CalendarTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) < -1);
        }

        public static bool operator >(CalendarTime x, DateTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) > 0);
        }

        public static bool operator <(CalendarTime x, DateTime y)
        {
            if (ReferenceEquals(x, null))
                throw new ArgumentNullException(nameof(x));

            return (x.CompareTo(y) < -1);
        }

        public static bool operator >(DateTime x, CalendarTime y)
        {
            if (ReferenceEquals(y, null))
                throw new ArgumentNullException(nameof(y));

            return (y.CompareTo(x) < 0);
        }

        public static bool operator <(DateTime x, CalendarTime y)
        {
            if (ReferenceEquals(y, null))
                throw new ArgumentNullException(nameof(y));

            return (y.CompareTo(x) > 0);
        }

        public byte Hour { get; private set; }

        public byte Min { get; private set; }

        public int TotalMinutes => 60 * Hour + Min;

        public static readonly CalendarTime First = new CalendarTime(00, 00);

        public static readonly CalendarTime Last = new CalendarTime(23, 59);
    }
}