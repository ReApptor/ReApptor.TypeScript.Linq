using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using WeAre.Athenaeum.Toolkit.Extensions;
using WeAre.Athenaeum.Toolkit.Scheduling.Rules;

namespace WeAre.Athenaeum.Toolkit.Scheduling
{
    [DebuggerDisplay("{ToScript()}")]
    public sealed class Scheduler : IScheduler
    {
        private static string[] _supportedRuleNames;
        private static readonly IDictionary<string, Type> RulesTypes;
        private readonly SortedList<byte, List<IScheduleRule>> _rules = new SortedList<byte, List<IScheduleRule>>();

        private static IScheduleRule[] GetRulesFromScript(string script)
        {
            var rules = new List<IScheduleRule>();
            foreach (KeyValuePair<string, Type> ruleTypePair in RulesTypes)
            {
                Type ruleType = ruleTypePair.Value;
                IScheduleRule rule = (IScheduleRule)Activator.CreateInstance(ruleType);
                if (rule.TryFromScript(script, out _))
                {
                    rules.Add(rule);
                }
            }
            return rules.ToArray();
        }

        private static DateTime ApplyTimeZone(DateTime timestamp, TimeZoneInfo timeZone)
        {
            return (timeZone != null) ? TimeZoneInfo.ConvertTimeFromUtc(timestamp, timeZone) : timestamp;
        }

        private static DateTime? ApplyTimeZone(DateTime? timestamp, TimeZoneInfo timeZone)
        {
            return ((timeZone != null) && (timestamp != null)) ? TimeZoneInfo.ConvertTimeFromUtc(timestamp.Value, timeZone) : timestamp;
        }

        private void SetRules(IEnumerable<IScheduleRule> rules)
        {
            _rules.Clear();
            foreach (IScheduleRule rule in rules)
            {
                byte priority = rule.GetPriority();
                if (!_rules.ContainsKey(priority))
                {
                    _rules.Add(priority, new List<IScheduleRule>());
                }
                _rules[priority].Add(rule);
            }
        }

        private bool Match(DateTime timestamp, DateTime? lastOccurence, bool includeDailyRules)
        {
            timestamp = ApplyTimeZone(timestamp, TimeZone);
            lastOccurence = ApplyTimeZone(lastOccurence, TimeZone);

            foreach (byte key in _rules.Keys)
            {
                if ((includeDailyRules) || (key < DailyRulesPriority))
                {
                    List<IScheduleRule> rules = _rules[key];
                    bool groupMatch = rules.Any(rule => rule.Match(timestamp, lastOccurence));
                    if (!groupMatch)
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        static Scheduler()
        {
            Type currentType = typeof(Scheduler);
            Type interfaceType = typeof(IScheduleRule);
            Assembly assembly = currentType.Assembly;
            RulesTypes = assembly
                .GetTypes()
                .Where(type => (type.IsClass) && (type != currentType) &&
                               (interfaceType.IsAssignableFrom(type)) &&
                               (type.GetConstructor(Type.EmptyTypes) != null))
                .ToDictionary(ConfigHelper.GetScheduleRuleConfigItemName, ruleType => ruleType);
        }

        public Scheduler()
        {
        }

        public Scheduler(string script)
        {
            FromScript(script);
        }

        public Scheduler(IDictionary<string, string> config)
        {
            FromConfig(config);
        }

        public Scheduler(IEnumerable<IScheduleRule> rules)
        {
            if (rules == null)
                throw new ArgumentNullException(nameof(rules));

            SetRules(rules);
        }

        public bool Match(DateTime timestamp, DateTime? lastOccurence = null)
        {
            return Match(timestamp, lastOccurence, true);
        }

        public byte GetPriority()
        {
            return 0;
        }

        public string GetConfigItemName()
        {
            return ConfigItemName;
        }

        public void FromScript(string script)
        {
            if (script == null)
                throw new ArgumentNullException(nameof(script));

            var rules = new List<IScheduleRule>();
            string[] items = script.Split(ScheduleConfigParser.RulesSeparators, StringSplitOptions.RemoveEmptyEntries);
            foreach (string item in items)
            {
                IScheduleRule[] acceptableRules = GetRulesFromScript(item);

                if (acceptableRules.Length == 0)
                    throw new ArgumentOutOfRangeException(nameof(script), $"Invalid script item \"{item}\" in script \"{script}\".");

                rules.AddRange(acceptableRules);
            }

            if (rules.Count == 0)
                throw new ArgumentOutOfRangeException(nameof(script), "Scheduler can not be parsed, no one rules were found in specified script \"{script}\".");

            SetRules(rules);
        }

        public bool TryFromScript(string script, out string error)
        {
            try
            {
                FromScript(script);
                error = null;
                return true;
            }
            catch (Exception ex)
            {
                error = $"Script \"{script}\" cannot be parsed. {ex.ToTraceString()}.";
                return false;
            }
        }

        public string ToScript()
        {
            var script = new StringBuilder();
            foreach (byte key in _rules.Keys)
            {
                List<IScheduleRule> rules = _rules[key];
                foreach (IScheduleRule rule in rules)
                {
                    script.Append($"{rule.ToScript()}; ");
                }
            }
            return script.ToString().Trim();
        }

        public void FromConfig(IDictionary<string, string> config)
        {
            if (config == null)
                throw new ArgumentNullException(nameof(config));

            //Extract rules:
            var rules = new List<IScheduleRule>();
            IDictionary<string, string>[] scheduleConfigItems = config.GetTypes(ConfigTypeName, ConfigItemName);
            foreach (IDictionary<string, string> scriptItems in scheduleConfigItems)
            {
                IDictionary<string, string> scriptConfigItems = scriptItems.FilterByKey(ConfigItemName);
                if (scriptConfigItems.Count > 0)
                {
                    string script = string.Join(";", scriptConfigItems.Select(item => item.Value));
                    FromScript(script);
                    rules.AddRange(Rules);
                }
            }

            if (rules.Count == 0)
                throw new ArgumentOutOfRangeException(nameof(config), "Scheduler can not be parsed, no one rules were found in specified configuration.");

            SetRules(rules);

            //Check country/timezone
            string countryCode = config.ExtractSetting(CountryItemName);
            TimeZone = ScheduleHelper.FetchCountryTimeZone(countryCode);
        }

        public IDictionary<string, string> ToConfig()
        {
            string scheduleRuleName = $"{ConfigItemName}Rule";
            const string rulesContainerName = "rules";
            var config = new Dictionary<string, string>
            {
                {scheduleRuleName, null},
                {$"{scheduleRuleName}.{ConfigTypeName}", ConfigItemName},
                {$"{scheduleRuleName}.{rulesContainerName}", null},
            };
            foreach (byte key in _rules.Keys)
            {
                List<IScheduleRule> rules = _rules[key];
                //foreach (IScheduleRule rule in rules)
                for (int i = 0; i < rules.Count; i++)
                {
                    IScheduleRule rule = rules[i];
                    IDictionary<string, string> ruleConfig = rule.ToConfig();
                    foreach (var pair in ruleConfig)
                    {
                        string ruleName = pair.Key;
                        if (rules.Count > 1)
                        {
                            int index = (ruleName.IndexOf(".", StringComparison.InvariantCultureIgnoreCase));
                            string prefix;
                            string postfix;
                            if ((index > 0) && (index < ruleName.Length - 1))
                            {
                                prefix = ruleName.Substring(0, index);
                                postfix = ruleName.Substring(index);
                            }
                            else
                            {
                                prefix = ruleName;
                                postfix = string.Empty;
                            }
                            ruleName = $"{prefix}[{i + 1}]{postfix}";
                        }
                        string name = $"{scheduleRuleName}.{rulesContainerName}.{ruleName}";
                        config.Add(name, pair.Value);
                    }
                }
            }
            return config;
        }

        public DateTime[] GetOccurrences(DateTime from, DateTime to)
        {
            var dates = new List<DateTime>();
            DateTime? lastOccurence = null;
            const int minutesPerDay = 1440;
            DateTime date = from.Date;
            DateTime toDate = to.Date;
            while (date <= toDate)
            {
                if (Match(date, lastOccurence, false))
                {
                    if (!HasDailyRules)
                    {
                        lastOccurence = date;
                        dates.Add(date);
                    }
                    else
                    {
                        for (int min = 0; min <= minutesPerDay; min++)
                        {
                            DateTime timestampWithTime = date.AddMinutes(min);
                            if ((timestampWithTime >= from) && (timestampWithTime <= to))
                            {
                                if (Match(timestampWithTime, lastOccurence, true))
                                {
                                    lastOccurence = timestampWithTime;
                                    dates.Add(timestampWithTime);
                                }
                            }
                        }
                    }
                }
                date = date.AddDays(1);
            }
            return dates.ToArray();
        }

        public DateTime? GetNextOccurrence(DateTime timestamp, DateTime? lastOccurrence = null, DateTime? end = null)
        {
            end ??= new DateTime(ScheduleConfigParser.MaxYearNumber + 1, 1, 1);
            DateTime date = timestamp.Date;
            int minutes = ((int)(timestamp - date).TotalMinutes) + 1;
            const int minutesPerDay = 1440;
            while (date <= end)
            {
                if (Match(date, lastOccurrence, false))
                {
                    if (!HasDailyRules)
                    {
                        return date;
                    }
                    for (int min = minutes; min <= minutesPerDay; min++)
                    {
                        DateTime timestampWithTime = date.AddMinutes(min);
                        if (Match(timestampWithTime, lastOccurrence, true))
                        {
                            return timestampWithTime;
                        }
                    }
                }
                date = date.AddDays(1);
                minutes = 0;
            }
            return null;
        }

        public DateTime GetNextDateIntervalOccurrence(DateTime timestamp, DateTime lastOccurrence, DateTime? end = null)
        {
            end ??= new DateTime(ScheduleConfigParser.MaxYearNumber + 1, 1, 1);
            DateTime date = timestamp;
            while (date <= end)
            {
                if (Match(date, lastOccurrence, false))
                {
                    return date;
                }
                date = date.AddDays(1);
            }
            return end.Value;
        }

        public bool HasDailyRules => (_rules.ContainsKey(DailyRulesPriority));

        public int RulesCount => (_rules.Count > 0) ? _rules.Sum(x => x.Value.Count) : 0;

        public IScheduleRule[] Rules => _rules.Values.SelectMany(rules => rules).ToArray();

        public IScheduleRule[] DailyRules => (_rules.ContainsKey(DailyRulesPriority) ? _rules[DailyRulesPriority].ToArray() : new IScheduleRule[0]);

        public TimeZoneInfo TimeZone { get; set; }

        public static Scheduler Parse(string script)
        {
            script ??= string.Empty;
            
            var scheduler = new Scheduler(script);

            if (scheduler.RulesCount == 0)
                throw new ArgumentOutOfRangeException(nameof(script), "Scheduler can not be parsed, no one rules were found in specified script.");

            return scheduler;
        }

        public static Scheduler Parse(IDictionary<string, string> config)
        {
            config ??= new Dictionary<string, string>();

            var scheduler = new Scheduler(config);

            if (scheduler.RulesCount == 0)
                throw new ArgumentOutOfRangeException(nameof(config), "Scheduler can not be parsed, no one rules were found in specified configuration.");

            return scheduler;
        }

        public static Scheduler Parse(IDictionary<string, string> config, string ruleType)
        {
            if (config == null)
                throw new ArgumentNullException(nameof(config));
            if (config.Count <= 1)
                throw new ArgumentOutOfRangeException(nameof(config), "As minimum 2 config items should be presented in rule configuration.");
            if (string.IsNullOrWhiteSpace(ruleType))
                throw new ArgumentOutOfRangeException(nameof(ruleType), "Rule type is not specified (null, empty or white space).");

            Scheduler scheduler;
            const StringComparison comparison = StringComparison.InvariantCultureIgnoreCase;

            if (string.Compare(ruleType, ConfigItemName, comparison) == 0)
            {
                scheduler = new Scheduler();
                scheduler.FromConfig(config);
                return scheduler;
            }

            KeyValuePair<string, Type>[] rules = RulesTypes
                .Where(item => string.Compare(item.Key, ruleType, comparison) == 0)
                .ToArray();

            if (rules.Length == 0)
                throw new ArgumentOutOfRangeException(nameof(ruleType), $"Scheduler rule type \"{ruleType}\" is not supported.");

            IScheduleRule rule = (IScheduleRule)Activator.CreateInstance(rules[0].Value);
            rule.FromConfig(config);

            scheduler = new Scheduler(new[] { rule });
            return scheduler;
        }

        public static string[] GetSupportedRuleNames()
        {
            if (_supportedRuleNames == null)
            {
                List<string> names = RulesTypes.Select(pair => pair.Key).ToList();
                names.Add(ConfigItemName);
                _supportedRuleNames = names.ToArray();
            }
            return _supportedRuleNames;
        }

        #region Constants
        
        /// <summary>
        /// "Country"
        /// </summary>
        public const string CountryItemName = "Country";

        /// <summary>
        /// "ruleType"
        /// </summary>
        public const string ConfigTypeName = "ruleType";

        /// <summary>
        /// "Scheduler"
        /// </summary>
        public const string ConfigItemName = "Scheduler";

        /// <summary>
        /// "1" (Monthly)
        /// </summary>
        public const int MonthlyRulesPriority = 1;

        /// <summary>
        /// "2" (Weekly)
        /// </summary>
        public const int WeeklyRulesPriority = 2;

        /// <summary>
        /// "3" (Daily)
        /// </summary>
        public const int DailyRulesPriority = 3;

        #endregion
    }
}