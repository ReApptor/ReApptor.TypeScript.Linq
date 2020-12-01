using System;
using System.Collections.Generic;
using System.Linq;

namespace WeAre.Athenaeum.Toolkit.Scheduling
{
    internal static class ConfigHelper
    {
        public static IDictionary<string, string>[] GetTypes(this IDictionary<string, string> config, string keyName, string typeName)
        {
            if (config == null)
                throw new ArgumentNullException(nameof(config));
            if (keyName == null)
                throw new ArgumentNullException(nameof(keyName));
            if (string.IsNullOrWhiteSpace(keyName))
                throw new ArgumentOutOfRangeException(nameof(keyName), "Key name is white space.");
            if (typeName == null)
                throw new ArgumentNullException(nameof(typeName));
            if (string.IsNullOrWhiteSpace(typeName))
                throw new ArgumentOutOfRangeException(nameof(typeName), "Type name is white space.");

            Dictionary<string, string> configItems = config
                .Where(pair =>
                    (!string.IsNullOrWhiteSpace(pair.Key)) &&
                    (!string.IsNullOrWhiteSpace(pair.Value)) &&
                    (
                        (pair.Key.EndsWith("." + keyName, StringComparison.InvariantCultureIgnoreCase)) ||
                        (string.Compare(pair.Key, keyName, StringComparison.InvariantCultureIgnoreCase) == 0)) &&
                    (string.Compare(pair.Value, typeName, StringComparison.InvariantCultureIgnoreCase) == 0))
                .ToDictionary(pair => pair.Key, pair => pair.Value);

            var result = new List<IDictionary<string, string>>();
            foreach (KeyValuePair<string, string> configPair in configItems)
            {
                string name = configPair.Key;
                int index = name.LastIndexOf(".", StringComparison.InvariantCultureIgnoreCase);
                name = (index > 0) ? name.Substring(0, index) : name;

                configItems = config
                    .Where(pair => (!string.IsNullOrWhiteSpace(pair.Key)) && (
                        (pair.Key.StartsWith(name + ".", StringComparison.InvariantCultureIgnoreCase)) ||
                        (string.Compare(pair.Key, name, StringComparison.InvariantCultureIgnoreCase) == 0)))
                    .ToDictionary(pair => pair.Key, pair => pair.Value);

                result.Add(configItems);
            }

            return result.ToArray();
        }

        public static IDictionary<string, string> GetType(this IDictionary<string, string> config, string keyName, string typeName)
        {
            IDictionary<string, string>[] types = GetTypes(config, keyName, typeName);

            if (types.Length > 1)
                throw new ArgumentOutOfRangeException(nameof(config), $"More that one (\"{types.Length}\") config items found for \"{keyName}\"=\"{typeName}\".");

            if (types.Length == 1)
            {
                return types.Single();
            }

            return new Dictionary<string, string>();
        }

        public static IDictionary<string, string> FilterByKey(this IDictionary<string, string> config, string keyName)
        {
            if (config == null)
                throw new ArgumentNullException(nameof(config));
            if (keyName == null)
                throw new ArgumentNullException(nameof(keyName));
            if (string.IsNullOrWhiteSpace(keyName))
                throw new ArgumentOutOfRangeException(nameof(keyName), "Key name is white space.");

            IDictionary<string, string> scheduleConfigItems = config
                .Where(pair => (!string.IsNullOrWhiteSpace(pair.Key)) && (
                    (pair.Key.EndsWith("." + keyName, StringComparison.InvariantCultureIgnoreCase)) ||
                    (pair.Key.StartsWith(keyName + ".", StringComparison.InvariantCultureIgnoreCase)) ||
                    (pair.Key.Contains("." + keyName + ".")) ||
                    (string.Compare(pair.Key, keyName, StringComparison.InvariantCultureIgnoreCase) == 0)))
                .ToDictionary(pair => pair.Key, pair => pair.Value);

            return scheduleConfigItems;
        }
        
        public static string ExtractSetting(this IDictionary<string, string> settings, string keyName)
        {
            const StringComparison comparison = StringComparison.InvariantCultureIgnoreCase;
            string key = settings
                .Where(setting =>
                    (string.Compare(setting.Key, keyName, comparison) == 0) ||
                    (setting.Key.EndsWith($".{keyName}", comparison)))
                .Select(setting => setting.Key)
                .SingleOrDefault();

            string value = (key != null) ? settings[key] : null;
            value = value?.Trim();
            return value;
        }
        
        public static string GetScheduleRuleConfigItemName(Type ruleType)
        {
            if (ruleType == null)
                throw new ArgumentNullException(nameof(ruleType));
            if (!typeof(IScheduleRule).IsAssignableFrom(ruleType))
                throw new ArgumentOutOfRangeException(nameof(ruleType), $"Type \"{ruleType.FullName}\" does not implement interface \"{typeof(IScheduleRule).FullName}\".");
            if (ruleType.GetConstructor(Type.EmptyTypes) == null)
                throw new ArgumentOutOfRangeException(nameof(ruleType), $"Type \"{ruleType.FullName}\" does not have public default (parameterless) constructor.");

            var instance = (IScheduleRule) Activator.CreateInstance(ruleType);
            return instance.GetConfigItemName();
        }
    }
}