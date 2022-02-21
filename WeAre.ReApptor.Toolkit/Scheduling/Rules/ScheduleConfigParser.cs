using System;
using System.Collections.Generic;
using System.Linq;
using WeAre.ReApptor.Toolkit.Extensions;
using WeAre.ReApptor.Toolkit.Scheduling.Entities;

namespace WeAre.ReApptor.Toolkit.Scheduling.Rules
{
    public static class ScheduleConfigParser
    {
        private static readonly SortedList<string, PatternInfo[]> PatternCache = new SortedList<string, PatternInfo[]>();

        #region Constants

        public const int MinMonthNumber = 0;

        public const int MaxMonthNumber = 11;

        public const int MinDayOfWeekNumber = 0;

        public const int MaxDayOfWeekNumber = 6;

        public const int MinDayOfMonthNumber = 1;

        public const int MaxDayOfMonthNumber = 31;

        public const int MinYearNumber = 2015;

        public const int MaxYearNumber = 2099;

        public static readonly CalendarTime DefaultInterval = new CalendarTime(00, 01);

        public static readonly CalendarInterval DefaultCalendarInterval = new CalendarInterval($"{MinYearNumber} - {MaxYearNumber}");

        public static readonly CalendarTimestamp DefaultCalendarTimestamp = new CalendarTimestamp();

        public static readonly string[] AllKeywords = { "All", "Any" };

        public static readonly string[] WordSeparators = { " " };

        public static readonly string[] RulesSeparators = { ";" };

        #endregion

        #region Types

        public enum ConfigType
        {
            DaysNumbers,

            DayOfWeek,

            DaysOfWeek,

            WeeksInterval,

            WeeksNumbers,

            DateIntervalType,

            DateIntervalValue,

            Years,

            MonthsOfYear,

            Time,

            CalendarInterval,

            CalendarTimestamp
        }

        public class ConfigItemInfo
        {
            public ConfigType ConfigType;

            public Type Type;

            public Func<object, string> ToStringAction;

            public Func<string, object> FromStringAction;

            public Func<string, object, bool, string> AddValue;

            public object Default;
        }

        #endregion

        #region Private

        #region Type Converters

        private static bool TryParse(string value, ConfigItemInfo item, out object result)
        {
            result = null;
            if (!string.IsNullOrWhiteSpace(value))
            {
                value = value.Trim();
                try
                {
                    result = item.FromStringAction(value);
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }
            return false;
        }

        private static string IntToString(object value)
        {
            return (value != null) ? ((int)value).ToString() : "0";
        }

        private static object IntFromString(string value)
        {
            return (value != null) ? (int.Parse(value)) : 0;
        }

        private static string IntArrayToString(object value)
        {
            return (value is int[]) ? string.Join(", ", (int[])value) : string.Empty;
        }

        private static object IntArrayFromString(string value)
        {
            return value?
                .Split(new[] { ", ", "," }, StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToArray() ?? new int[0];
        }

        private static string IntArrayAdd(string existingValue, object newValueObject, bool interval)
        {
            int newValue = ((int[])newValueObject).Single();
            List<int> value = ((int[])IntArrayFromString(existingValue)).ToList();
            if ((interval) && (value.Count > 0) && (newValue > value.Last()))
            {
                for (var i = value.Last() + 1; i <= newValue; i++)
                {
                    value.Add(i);
                }
            }
            else
            {
                value.Add(newValue);
            }
            return IntArrayToString(value.ToArray());
        }

        private static string TimeToString(object value)
        {
            return (value as CalendarTime)?.ToString() ?? string.Empty;
        }

        private static object TimeFromString(string value)
        {
            return new CalendarTime(value);
        }

        private static string CalendarIntervalToString(object value)
        {
            return (value as CalendarInterval)?.ToString() ?? string.Empty;
        }

        private static object CalendarIntervalFromString(string value)
        {
            return new CalendarInterval(value);
        }

        private static string CalendarTimestampToString(object value)
        {
            return (value as CalendarTimestamp)?.ToString() ?? string.Empty;
        }

        private static object CalendarTimestampFromString(string value)
        {
            return new CalendarTimestamp(value);
        }

        private static string FlagsToString(object value)
        {
            return value.ToString();
        }

        private static string DayOfWeekToString(object value)
        {
            return (value != null) ? ((DayOfWeek)value).ToString() : "";
        }

        private static object DayOfWeekFromString(string value)
        {
            int intValue;
            if (int.TryParse(value, out intValue))
            {
                var dayOfWeek = (DayOfWeek)Enum.Parse(typeof(DayOfWeek), value);
                return dayOfWeek;
            }
            return Enum.Parse(typeof(DayOfWeek), value);
        }

        private static object DaysOfWeekFromString(string value)
        {
            if (value != null)
            {
                int intValue;
                if (int.TryParse(value, out intValue))
                {
                    var dayOfWeek = (DayOfWeek)Enum.Parse(typeof(DayOfWeek), value);
                    return dayOfWeek.Convert();
                }
                if ((string.Compare(value, "Any", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                    (string.Compare(value, "All", StringComparison.InvariantCultureIgnoreCase) == 0))
                {
                    return DaysOfWeek.All;
                }
                return Enum.Parse(typeof(DaysOfWeek), value);
            }
            return DaysOfWeek.None;
        }

        private static string DaysOfWeekAdd(string existingValue, object newValueObject, bool interval)
        {
            var newValue = (DaysOfWeek)newValueObject;
            if (newValue == DaysOfWeek.All)
            {
                return FlagsToString(newValue);
            }
            DayOfWeek dayOfWeek = newValue.GetValues().Single();
            var value = (DaysOfWeek)DaysOfWeekFromString(existingValue);
            const int daysPerWeek = 7;
            if (interval)
            {
                DayOfWeek[] values = value.GetValues();
                DayOfWeek firstValue = (values.Length > 0) ? values.Max() : DayOfWeek.Sunday;

                DayOfWeek from = firstValue;
                DayOfWeek to = dayOfWeek;

                if (from > to)
                {
                    to += daysPerWeek;
                }

                while (from < to)
                {
                    var nextValue = ((int)from >= daysPerWeek)
                        ? from - daysPerWeek
                        : from;
                    value = value.Add(nextValue);
                    from++;
                }
            }
            value = value.Add(dayOfWeek);
            return FlagsToString(value);
        }

        private static object MonthsOfYearFromString(string value)
        {
            if (value != null)
            {
                int intValue;
                if (int.TryParse(value, out intValue))
                {
                    var monthOfYear = (MonthOfYear)Enum.Parse(typeof(MonthOfYear), value);
                    return monthOfYear.Convert();
                }
                if ((string.Compare(value, "Any", StringComparison.InvariantCultureIgnoreCase) == 0) ||
                    (string.Compare(value, "All", StringComparison.InvariantCultureIgnoreCase) == 0))
                {
                    return MonthsOfYear.All;
                }
                return Enum.Parse(typeof(MonthsOfYear), value);
            }
            return MonthsOfYear.None;
        }

        private static string MonthsOfYearAdd(string existingValue, object newValueObject, bool interval)
        {
            var newValue = (MonthsOfYear)newValueObject;
            if (newValue == MonthsOfYear.All)
            {
                return FlagsToString(newValue);
            }
            MonthOfYear monthOfYear = newValue.GetValues().Single();
            var value = (MonthsOfYear)MonthsOfYearFromString(existingValue);
            if (interval)
            {
                MonthOfYear[] values = value.GetValues();
                MonthOfYear firstValue = (values.Length > 0) ? values.Max() : MonthOfYear.January;
                while (firstValue < monthOfYear)
                {
                    value = value.Add(firstValue);
                    firstValue++;
                }
            }
            value = value.Add(monthOfYear);
            return FlagsToString(value);
        }

        private static object DateIntervalFromString(string value)
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                return Enum.Parse(typeof(DateInterval), value, true);
            }
            return null;
        }

        #endregion

        private static PatternInfo GetPatternInfo(string patternItem)
        {
            bool variable = ((patternItem.Contains("{")) && (patternItem.Contains("}")));
            string patternName = patternItem
                .Replace("{", string.Empty)
                .Replace("}", string.Empty)
                .Replace("[", string.Empty)
                .Replace("]", string.Empty);

            if (variable)
            {
                string name = patternName;
                int index = (patternName.IndexOf(":", StringComparison.InvariantCultureIgnoreCase));
                if ((index > 0) && (index < patternName.Length - 1))
                {
                    name = patternName.Substring(0, index);
                    patternName = patternName.Substring(index + 1);
                }

                ConfigItemInfo variableItem = ConfigItems.SingleOrDefault(x => string.Compare(patternName, x.ConfigType.ToString(), StringComparison.InvariantCultureIgnoreCase) == 0);

                if (variableItem == null)
                    throw new FormatException($"Invalid pattern format. Unknown variable type \"{patternItem}\".");

                var patternInfo = new PatternInfo
                {
                    Name = name,
                    Item = variableItem,
                    Variable = true,
                };
                return patternInfo;
            }

            return new PatternInfo
            {
                Variable = false,
                Name = patternName,
            };
        }

        private class PatternInfo
        {
            public string Name;

            public bool Variable;

            public bool Mandatory;

            public int NextMandatorIndex;

            public ConfigItemInfo Item;

            public bool IsInterval
            {
                get
                {
                    return ((!Variable) && (!string.IsNullOrWhiteSpace(Name)) &&
                            (Name.Equals("-", StringComparison.InvariantCultureIgnoreCase)));
                }
            }
        }

        private static int StartsWithCount(string value, char prefix)
        {
            value = value ?? string.Empty;
            int count = 0;
            for (int i = 0; i < value.Length; i++)
            {
                if (value[i] == prefix)
                {
                    count++;
                }
                else
                {
                    break;
                }
            }
            return count;
        }

        private static int EndsWithCount(string value, char prefix)
        {
            value = value ?? string.Empty;
            int count = 0;
            for (int i = value.Length - 1; i >= 0; i--)
            {
                if (value[i] == prefix)
                {
                    count++;
                }
                else
                {
                    break;
                }
            }
            return count;
        }

        private static string Precompile(string script)
        {
            script = script ?? string.Empty;
            script = script.Replace("][", "] [");
            script = script.Replace(",", ", ");
            script = script.Replace("-", "- ");
            while (script.Contains(" ,"))
            {
                script = script.Replace(" ,", ",");
            }
            while (script.Contains(" -"))
            {
                script = script.Replace(" -", "-");
            }
            while (script.Contains("  "))
            {
                script = script.Replace("  ", " ");
            }
            return script;
        }

        private static PatternInfo[] ParsePattern(string pattern)
        {
            lock (PatternCache)
            {
                int index = PatternCache.IndexOfKey(pattern);
                if (index != -1)
                {
                    return PatternCache.Values[index];
                }

                string[] patternItems = pattern.Split(WordSeparators, StringSplitOptions.RemoveEmptyEntries);
                var result = new List<PatternInfo>();
                for (int i = 0; i < patternItems.Length; i++)
                {
                    string patternItem = patternItems[i];
                    PatternInfo patternInfo = GetPatternInfo(patternItem);
                    patternInfo.Mandatory = true;
                    int mandatoryIndex = StartsWithCount(patternItem, '[');
                    if (mandatoryIndex > 0)
                    {
                        mandatoryIndex = 0;
                        int nextMandatoryIndex = patternItems.Length;
                        for (int j = i; j < patternItems.Length; j++)
                        {
                            string nextPatternItem = patternItems[j];
                            mandatoryIndex += StartsWithCount(nextPatternItem, '[');
                            mandatoryIndex -= EndsWithCount(nextPatternItem, ']');
                            if (mandatoryIndex <= 0)
                            {
                                nextMandatoryIndex = j + 1;
                                break;
                            }
                        }
                        patternInfo.Mandatory = false;
                        patternInfo.NextMandatorIndex = nextMandatoryIndex;
                    }
                    result.Add(patternInfo);
                }
                PatternInfo[] patternRules = result.ToArray();
                PatternCache.Add(pattern, patternRules);
                return patternRules;
            }
        }

        #endregion

        public static IDictionary<string, string> Parse(string pattern, string script)
        {
            IDictionary<string, string> configs;
            string error;
            if (!Parse(pattern, script, out configs, out error))
            {
                throw new ArgumentOutOfRangeException(nameof(script), error);
            }
            return configs;
        }

        public static bool Parse(string pattern, string script, out IDictionary<string, string> configs, out string error)
        {
            script = Precompile(script);
            PatternInfo[] patternItems = ParsePattern(pattern);

            string[] items = script.Split(WordSeparators, StringSplitOptions.RemoveEmptyEntries);

            int patternIndex = 0;
            configs = new Dictionary<string, string>();
            error = null;
            int index = 0;
            if (items.Length > 0)
            {
                bool previousIntervalExpected = false;
                while (true)
                {
                    PatternInfo patternItem;
                    if (index >= items.Length)
                    {
                        int nextPatternIndex = patternIndex;
                        while (true)
                        {
                            if (nextPatternIndex >= patternItems.Length)
                            {
                                break;
                            }
                            patternItem = patternItems[nextPatternIndex];
                            if (!patternItem.Mandatory)
                            {
                                nextPatternIndex = patternItem.NextMandatorIndex;
                            }
                            else
                            {
                                error = $"Script cannot be parsed. Script \"{script}\". Mandatory pattern item is not found in script. Pattern \"{pattern}\". Pattern item with error \"{patternItem.Name}\".";
                                return false;
                            }
                        }
                        break;
                    }

                    string item = items[index];

                    if (patternIndex >= patternItems.Length)
                    {
                        error = $"Script cannot be parsed. Script \"{script}\". Pattern \"{pattern}\". Unknown pattern item. Pattern item with error \"{item}\".";
                        return false;
                    }

                    patternItem = patternItems[patternIndex];
                    PatternInfo nextPatternItem = (patternIndex < patternItems.Length - 1)
                        ? patternItems[patternIndex + 1]
                        : null;
                    bool nextPatternIsInterval = (nextPatternItem != null) && (nextPatternItem.IsInterval);

                    bool parsed;
                    bool nextValueExpected = false;
                    bool skipIntervalPattern = false;
                    if (patternItem.Variable)
                    {
                        ConfigItemInfo info = patternItem.Item;
                        bool enumerable = (info.AddValue != null);
                        bool intervalExpected = (item.EndsWith("-", StringComparison.InvariantCultureIgnoreCase));
                        nextValueExpected = (intervalExpected) || (item.EndsWith(",", StringComparison.InvariantCultureIgnoreCase));

                        if ((!enumerable) && (intervalExpected) && (nextPatternIsInterval))
                        {
                            skipIntervalPattern = true;
                            nextValueExpected = false;
                        }

                        if (nextValueExpected)
                        {
                            if ((item.Length == 1) || (!enumerable))
                            {
                                error = $"Script cannot be parsed. Script \"{script}\". Pattern \"{pattern}\". Script value cannot be parsed. item. Pattern item with error \"{item}\"";
                                return false;
                            }

                            item = item.Substring(0, item.Length - 1);
                        }

                        object newValue;
                        parsed = TryParse(item, info, out newValue);
                        if (parsed)
                        {
                            if (!configs.ContainsKey(patternItem.Name))
                            {
                                configs.Add(patternItem.Name, null);
                            }
                            string value;
                            if (enumerable)
                            {
                                value = configs[patternItem.Name];
                                try
                                {
                                    value = info.AddValue(value, newValue, previousIntervalExpected);
                                }
                                catch (Exception ex)
                                {
                                    error = $"Script cannot be parsed. Script \"{script}\". Pattern \"{pattern}\". Script value cannot be parsed. Pattern item with error \"{patternItem.Name}\". {ex.ToTraceString()}.";
                                    return false;
                                }
                            }
                            else
                            {
                                value = info.ToStringAction(newValue);
                            }
                            configs[patternItem.Name] = value;
                        }

                        previousIntervalExpected = ((intervalExpected) && (parsed));
                    }
                    else
                    {
                        string patternName = patternItem.Name;
                        parsed = (string.Compare(item, patternName, StringComparison.CurrentCultureIgnoreCase) == 0);
                        if (!parsed)
                        {
                            patternName += "-";
                            parsed = (string.Compare(item, patternName, StringComparison.CurrentCultureIgnoreCase) == 0);
                            if (parsed)
                            {
                                List<string> newItems = items.ToList();
                                newItems[index] = patternItem.Name;
                                newItems.Insert(index + 1, "-");
                                items = newItems.ToArray();
                            }
                        }
                        previousIntervalExpected = false;
                    }

                    if (parsed)
                    {
                        index++;
                        if (!nextValueExpected)
                        {
                            patternIndex++;
                        }
                        if (skipIntervalPattern)
                        {
                            patternIndex++;
                        }
                    }
                    else if (!patternItem.Mandatory)
                    {
                        patternIndex = patternItem.NextMandatorIndex;
                    }
                    else
                    {
                        error = $"Script cannot be parsed. Script \"{script}\". Pattern \"{pattern}\". Mandatory pattern item cannot be parsed. Pattern item with error \"{item}\".";
                        return false;
                    }
                }
            }

            return true;
        }

        #region Configuration Items

        public static readonly ConfigItemInfo[] ConfigItems =
        {
            new ConfigItemInfo
            {
                Type = typeof(int[]),
                ConfigType = ConfigType.DaysNumbers,
                ToStringAction = IntArrayToString,
                FromStringAction = IntArrayFromString,
                AddValue = IntArrayAdd,
                Default = new int[0]
            },
            new ConfigItemInfo
            {
                Type = typeof(DayOfWeek),
                ConfigType = ConfigType.DayOfWeek,
                ToStringAction = DayOfWeekToString,
                FromStringAction = DayOfWeekFromString,
                AddValue = null,
                Default = ScheduleHelper.GetFirstDayOfWeek()
            },
            new ConfigItemInfo
            {
                Type = typeof(DaysOfWeek),
                ConfigType = ConfigType.DaysOfWeek,
                ToStringAction = FlagsToString,
                FromStringAction = DaysOfWeekFromString,
                AddValue = DaysOfWeekAdd,
                Default = DaysOfWeek.All
            },
            new ConfigItemInfo
            {
                Type = typeof(MonthsOfYear),
                ConfigType = ConfigType.MonthsOfYear,
                ToStringAction = FlagsToString,
                FromStringAction = MonthsOfYearFromString,
                AddValue = MonthsOfYearAdd,
                Default = MonthsOfYear.All
            },
            new ConfigItemInfo
            {
                Type = typeof(int),
                ConfigType = ConfigType.WeeksInterval,
                ToStringAction = IntToString,
                FromStringAction = IntFromString,
                AddValue = null,
                Default = 1
            },
            new ConfigItemInfo
            {
                Type = typeof(int),
                ConfigType = ConfigType.DateIntervalValue,
                ToStringAction = IntToString,
                FromStringAction = IntFromString,
                AddValue = null,
                Default = 1
            },
            new ConfigItemInfo
            {
                Type = typeof(int),
                ConfigType = ConfigType.DateIntervalType,
                ToStringAction = FlagsToString,
                FromStringAction = DateIntervalFromString,
                AddValue = null,
                Default = 1
            },
            new ConfigItemInfo
            {
                Type = typeof(int[]),
                ConfigType = ConfigType.WeeksNumbers,
                ToStringAction = IntArrayToString,
                FromStringAction = IntArrayFromString,
                AddValue = IntArrayAdd,
                Default = new int[0]
            },
            new ConfigItemInfo
            {
                Type = typeof(int[]),
                ConfigType = ConfigType.Years,
                ToStringAction = IntArrayToString,
                FromStringAction = IntArrayFromString,
                AddValue = IntArrayAdd,
                Default = new int[0]
            },
            new ConfigItemInfo
            {
                Type = typeof(CalendarTime),
                ConfigType = ConfigType.Time,
                ToStringAction = TimeToString,
                FromStringAction = TimeFromString,
                AddValue = null,
                Default = null
            },
            new ConfigItemInfo
            {
                Type = typeof(CalendarInterval),
                ConfigType = ConfigType.CalendarInterval,
                ToStringAction = CalendarIntervalToString,
                FromStringAction = CalendarIntervalFromString,
                AddValue = null,
                Default = DefaultCalendarInterval
            },
            new ConfigItemInfo
            {
                Type = typeof(CalendarTimestamp),
                ConfigType = ConfigType.CalendarTimestamp,
                ToStringAction = CalendarTimestampToString,
                FromStringAction = CalendarTimestampFromString,
                AddValue = null,
                Default = DefaultCalendarTimestamp
            }
        };
        #endregion
    }
}