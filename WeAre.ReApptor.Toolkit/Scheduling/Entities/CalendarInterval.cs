using System;

namespace WeAre.ReApptor.Toolkit.Scheduling.Entities
{
    public sealed class CalendarInterval : IEquatable<CalendarInterval>
    {
        private bool TryParse(string value, out string error)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                error = "Value is null or white space.";
                return false;
            }

            //[CalendarInterval]-[CalendarInterval]
            value = value.Trim();
            bool hasError = (!value.Contains("-"));
            CalendarTimestamp from = null;
            CalendarTimestamp to = null;
            if (!hasError)
            {
                string[] items = value.Split(new[] {" - ", "-"}, StringSplitOptions.None);

                if ((items.Length == 1) || (items.Length == 2))
                {
                    hasError = ((!string.IsNullOrWhiteSpace(items[0])) && (!CalendarTimestamp.TryParse(items[0], out from))) ||
                            ((items.Length == 2) && (!string.IsNullOrWhiteSpace(items[1])) && (!CalendarTimestamp.TryParse(items[1], out to)));
                }
                else if (items.Length > 2)
                {
                    hasError = true;
                }
            }

            if (hasError)
            {
                error = $"Invalid timestamp format \"{value}\".";
                return false;
            }

            if ((from != null) && (to != null))
            {
                if ((to.Year != null) && (from.Year == null))
                {
                    from = new CalendarTimestamp(from.Day, from.Month, to.Year);
                }
                if ((to.Month != null) && (from.Month == null))
                {
                    from = new CalendarTimestamp(from.Day, to.Month, from.Year);
                }

                if (!from.CanBeCompared(to))
                {
                    error = $"Invalid timestamp format \"{value}\". Both part should be in the same formats.";
                    return false;
                }
                if (from.CompareTo(to) >= 0)
                {
                    error = $"Invalid timestamp format \"{value}\". From \"{from}\" should be less the To \"{to}\".";
                    return false;
                }
            }

            From = from;
            To = to;

            error = null;
            return true;
        }

        public CalendarInterval()
        {
        }

        public CalendarInterval(string value)
        {
            string error;
            if (!TryParse(value, out error))
            {
                throw new ArgumentOutOfRangeException(nameof(value), error);
            }
        }

        public CalendarInterval(CalendarTimestamp from, CalendarTimestamp to)
        {
            From = from;
            To = to;
        }

        public bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            bool match = ((From == null) || (From.CompareTo(timestamp) <= 0));
            match &= ((To == null) || (To.CompareTo(timestamp) >= 0));
            return match;
        }

        public bool Equals(CalendarInterval other)
        {
            if (ReferenceEquals(other, null))
            {
                return false;
            }
            if (ReferenceEquals(other, this))
            {
                return true;
            }
            return (From == other.From) && (To == other.To);
        }

        public override bool Equals(object other)
        {
            return Equals(other as CalendarInterval);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return ((From?.GetHashCode() ?? 0) * 397) ^ (To?.GetHashCode() ?? 0);
            }
        }

        public override string ToString()
        {
            if ((From == null) && (To == null))
            {
                return string.Empty;
            }
            string from = From?.ToString() ?? string.Empty;
            string to = To?.ToString() ?? string.Empty;
            return $"{from} - {to}";
        }

        public static bool TryParse(string s, out CalendarInterval interval, out string error)
        {
            interval = new CalendarInterval();
            return interval.TryParse(s, out error);
        }

        public static bool TryParse(string s, out CalendarInterval interval)
        {
            interval = new CalendarInterval();
            string error;
            return interval.TryParse(s, out error);
        }

        public static bool operator ==(CalendarInterval x, CalendarInterval y)
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

        public static bool operator !=(CalendarInterval x, CalendarInterval y)
        {
            return !(x == y);
        }

        public CalendarTimestamp From { get; private set; }

        public CalendarTimestamp To { get; private set; }
    }
}