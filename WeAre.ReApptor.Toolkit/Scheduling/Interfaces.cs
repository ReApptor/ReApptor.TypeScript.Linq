using System;
using System.Collections.Generic;

namespace WeAre.ReApptor.Toolkit.Scheduling
{
    public interface IScheduleConfigurable
    {
        string GetConfigItemName();

        /// <summary>
        /// Initialize the rule from configuration items
        /// </summary>
        void FromConfig(IDictionary<string, string> config);

        /// <summary>
        /// Returns configuration items
        /// </summary>
        IDictionary<string, string> ToConfig();
    }

    public interface IScheduleScriptable
    {
        void FromScript(string script);

        bool TryFromScript(string script, out string error);

        string ToScript();
    }

    public interface IScheduleRule : IScheduleConfigurable, IScheduleScriptable
    {
        /// <summary>
        /// Shows, that the specified timestamp matches the current rule.
        /// </summary>
        bool Match(DateTime timestamp, DateTime? lastOccurence = null);

        /// <summary>
        /// Return the executing priority number.
        /// All rules with the same priority executes using "OR" operation.
        /// All rules with different priority executes with "AND" operation.
        /// Rules groups executes in order of priority.
        /// </summary>
        byte GetPriority();
    }

    public interface IScheduler : IScheduleRule
    {
        DateTime? GetNextOccurrence(DateTime timestamp, DateTime? lastOccurrence = null, DateTime? end = null);

        DateTime[] GetOccurrences(DateTime from, DateTime to);
    }
}