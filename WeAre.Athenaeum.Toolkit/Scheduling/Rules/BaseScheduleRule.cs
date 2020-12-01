using System;
using System.Collections.Generic;
using System.Linq;
using WeAre.Athenaeum.Toolkit.Extensions;
using WeAre.Athenaeum.Toolkit.Scheduling.Attributes;

namespace WeAre.Athenaeum.Toolkit.Scheduling.Rules
{
    public abstract class BaseScheduleRule : IScheduleRule
    {
        private readonly ScheduleRuleAttribute _attribute;

        protected BaseScheduleRule()
        {
            _attribute = ScheduleRuleAttribute.GetAttributes(GetType());
            foreach (ScheduleConfigItemAttribute attribute in _attribute.ConfigItems)
            {
                object defaultValue = attribute.DefaultValue;
                attribute.Property.SetValue(this, defaultValue);
            }
        }

        protected virtual string Preparse(string config)
        {
            return config;
        }

        protected virtual string GetPattern()
        {
            return _attribute.Pattern;
        }

        public virtual string GetConfigItemName()
        {
            return _attribute.ConfigItemName;
        }

        public virtual byte GetPriority()
        {
            return _attribute.Priority;
        }

        public abstract bool Match(DateTime timestamp, DateTime? lastOccurence = null);

        public IDictionary<string, string> ToConfig()
        {
            string configItemName = GetConfigItemName();

            var config = new Dictionary<string, string>
            {
                {configItemName, null},
                {$"{configItemName}.{Scheduler.ConfigTypeName}", configItemName}
            };

            foreach (ScheduleConfigItemAttribute attribute in _attribute.ConfigItems)
            {
                string key = $"{configItemName}.{attribute.ConfigItemName}";
                object value = attribute.Property.GetValue(this);
                string stringValue = attribute.Item.ToStringAction(value);
                config.Add(key, stringValue);
            }

            return config;
        }

        public virtual void FromConfig(IDictionary<string, string> config)
        {
            if (config == null)
                throw new ArgumentNullException(nameof(config));

            string configItemName = GetConfigItemName();
            IDictionary<string, string> scheduleConfigItems = config.GetType(Scheduler.ConfigTypeName, configItemName);

            if (scheduleConfigItems.Count == 0)
                throw new ArgumentOutOfRangeException($"No config items found for schedule rule \"{Scheduler.ConfigTypeName}={configItemName}\".");

            if (scheduleConfigItems.Count == 1)
            {
                string script = scheduleConfigItems.Single().Value;
                FromScript(script);
            }
            else
            {
                foreach (ScheduleConfigItemAttribute attribute in _attribute.ConfigItems)
                {
                    string itemName = $".{attribute.ConfigItemName}";
                    string[] keys = scheduleConfigItems.Keys
                        .Where(key => (key.TrimEnd().EndsWith(itemName, StringComparison.InvariantCultureIgnoreCase)))
                        .ToArray();

                    if (keys.Length > 1)
                        throw new ArgumentOutOfRangeException($"There are several \"{attribute.ConfigItemName}\" configuration items for \"{configItemName}\" schedule rule.");

                    if (keys.Length == 0)
                    {
                        string alternativeItemName = $".{attribute.Property.Name}";
                        keys = scheduleConfigItems.Keys
                            .Where(key => (key.TrimEnd().EndsWith(alternativeItemName, StringComparison.InvariantCultureIgnoreCase)))
                            .ToArray();
                    }

                    object value = null;
                    if (keys.Length == 1)
                    {
                        string key = keys.Single();
                        string configItemValue = config[key];
                        try
                        {
                            value = attribute.Item.FromStringAction(configItemValue);
                        }
                        catch (Exception ex)
                        {
                            string message = $"The configuration item \"{attribute.ConfigItemName}\"=\"{configItemValue}\" cannot be parsed for schedule rule \"{Scheduler.ConfigTypeName}={configItemName}\".\r\n{ex.Message}.";
                            throw new ArgumentOutOfRangeException(message, ex);
                        }
                    }
                    else if (attribute.Mandatory)
                        throw new ArgumentOutOfRangeException($"The mandatory \"{attribute.ConfigItemName}\" configuration item not found for schedule rule \"{Scheduler.ConfigTypeName}={configItemName}\".");

                    value ??= attribute.DefaultValue;

                    attribute.Property.SetValue(this, value);
                }
            }
        }

        public abstract string ToScript();

        public virtual void FromScript(string script)
        {
            if (!TryFromScript(script, out string error))
            {
                throw new ArgumentOutOfRangeException(nameof(script), error);
            }
        }

        public virtual bool TryFromScript(string script, out string error)
        {
            try
            {
                if (script == null)
                    throw new ArgumentNullException(nameof(script));

                script = Preparse(script);
                string pattern = GetPattern();
                if (string.IsNullOrWhiteSpace(pattern))
                {
                    error = $"Rule type \"{GetType().FullName}\" cannot be parsed. Pattern is not defined.";
                    return false;
                }

                bool parsed = ScheduleConfigParser.Parse(pattern, script, out IDictionary<string, string> configItems, out error);
                if (!parsed)
                {
                    error = $"Rule type \"{GetType().FullName}\" cannot be parsed. {error}";
                    return false;
                }

                string configItemName = GetConfigItemName();
                var config = new Dictionary<string, string>
                {
                    {configItemName, null},
                    {$"{configItemName}.{Scheduler.ConfigTypeName}", configItemName}
                };
                foreach (var pair in configItems)
                {
                    config.Add($"{configItemName}.{pair.Key}", pair.Value);
                }
                FromConfig(config);
                return true;
            }
            catch (Exception ex)
            {
                error = $"Rule type \"{GetType().FullName}\" cannot be parsed. {ex.ToTraceString()}.";
                return false;
            }
        }
    }
}