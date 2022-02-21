using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using WeAre.ReApptor.Toolkit.Scheduling.Rules;

namespace WeAre.ReApptor.Toolkit.Scheduling.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ScheduleConfigItemAttribute : Attribute
    {
        private ScheduleConfigParser.ConfigType DefineConfigType(Type type, PropertyInfo property)
        {
            if (ConfigType != null)
            {
                return ConfigType.Value;
            }

            string propertyName = property.Name;
            if (Enum.TryParse(propertyName, true, out ScheduleConfigParser.ConfigType configType))
            {
                return configType;
            }

            ScheduleConfigParser.ConfigItemInfo[] items = ScheduleConfigParser.ConfigItems.Where(item => item.Type == property.PropertyType).ToArray();

            if (items.Length == 1)
            {
                return items.Single().ConfigType;
            }

            throw new InvalidOperationException($"The config type ({nameof(ConfigType)})is not specified in \"{typeof(ScheduleConfigItemAttribute)}\" attribute for type \"{type.FullName}\".");
        }

        private object DefineDefaultValue(ScheduleConfigParser.ConfigItemInfo configItem)
        {
            object defaultValue = null;
            if (!string.IsNullOrWhiteSpace(Default))
            {
                defaultValue = configItem.FromStringAction(Default);
            }
            defaultValue ??= configItem.Default;
            return defaultValue;
        }

        public static ScheduleConfigItemAttribute[] GetAttributes(Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            var attributes = new List<ScheduleConfigItemAttribute>();
            PropertyInfo[] properties = type.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var attribute = property.GetCustomAttribute<ScheduleConfigItemAttribute>();
                if (attribute != null)
                {
                    ScheduleConfigParser.ConfigType configType = attribute.DefineConfigType(type, property);
                    string configItemName = (!string.IsNullOrWhiteSpace(attribute.ConfigItemName))
                        ? attribute.ConfigItemName
                        : property.Name;
                    ScheduleConfigParser.ConfigItemInfo configItem =
                        ScheduleConfigParser.ConfigItems.Single(item => item.ConfigType == configType);
                    object defaultValue = attribute.DefineDefaultValue(configItem);
                    attribute.Property = property;
                    attribute.Item = configItem;
                    attribute.ConfigType = configType;
                    attribute.ConfigItemName = configItemName;
                    attribute.DefaultValue = defaultValue;
                    attributes.Add(attribute);
                }
            }
            return attributes.ToArray();
        }

        public ScheduleConfigParser.ConfigType? ConfigType { get; set; }

        public string ConfigItemName { get; set; }

        public bool Mandatory { get; set; }

        public string Default { get; set; }

        public object DefaultValue { get; private set; }

        public ScheduleConfigParser.ConfigItemInfo Item { get; private set; }

        public PropertyInfo Property { get; private set; }
    }
}