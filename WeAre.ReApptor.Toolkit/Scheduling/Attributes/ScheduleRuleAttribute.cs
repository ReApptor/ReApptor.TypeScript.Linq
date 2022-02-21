using System;
using System.Collections.Generic;
using System.Reflection;
using WeAre.ReApptor.Toolkit.Extensions;

namespace WeAre.ReApptor.Toolkit.Scheduling.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class ScheduleRuleAttribute : Attribute
    {
        private static readonly SortedList<string, ScheduleRuleAttribute> Cache = new SortedList<string, ScheduleRuleAttribute>();

        public static ScheduleRuleAttribute GetAttributes(Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            lock (Cache)
            {
                string hashCode = type.GetFullName();
                int index = Cache.IndexOfKey(hashCode);
                if (index != -1)
                {
                    return Cache.Values[index];
                }

                var attribute = type.GetCustomAttribute<ScheduleRuleAttribute>();
                if (attribute == null)
                    throw new ArgumentOutOfRangeException(nameof(type), $"Specified type \"{type.FullName}\" does not marked by \"{nameof(ScheduleRuleAttribute)}\" attribute.");

                if (string.IsNullOrWhiteSpace(attribute.ConfigItemName))
                {
                    attribute.ConfigItemName = type.Name.Replace("ScheduleRule", string.Empty);
                }
                attribute.ConfigItems = ScheduleConfigItemAttribute.GetAttributes(type);
                Cache.Add(hashCode, attribute);
                return attribute;
            }
        }

        public ScheduleRuleAttribute(byte priority)
        {
            Priority = priority;
        }

        public ScheduleRuleAttribute(string pattern, byte priority)
        {
            if (pattern == null)
                throw new ArgumentNullException(nameof(pattern));
            if (string.IsNullOrWhiteSpace(pattern))
                throw new ArgumentOutOfRangeException(nameof(pattern), "Pattern is white space.");

            Pattern = pattern;
            Priority = priority;
        }

        public string ConfigItemName { get; set; }

        public string Pattern { get; }

        public byte Priority { get; }

        public ScheduleConfigItemAttribute[] ConfigItems { get; private set; }
    }
}