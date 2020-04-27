using System;
using System.Configuration;
using System.Reflection;

namespace Renta.Components.Common.Configuration
{
    public abstract class EnvironmentConfiguration
    {
        protected string GetEnvironmentVariable(string key, bool throwExceptionIfNotFound = true)
        {
            string value = Environment.GetEnvironmentVariable(key);

            if (value == null && throwExceptionIfNotFound)
            {
                string entryName = Assembly.GetEntryAssembly()?.FullName;
                throw new ConfigurationErrorsException($"Unable to find environment variable with key \"{key}\". EntryName=\"{entryName}\".");
            }

            return value;
        }

        protected string GetEnvironmentVariable(string key, string @default)
        {
            string value = GetEnvironmentVariable(key, false);

            return (!string.IsNullOrWhiteSpace(value)) ? value : @default;
        }

        protected int GetIntEnvironmentVariable(string key, int? @default = null)
        {
            string value = GetEnvironmentVariable(key, false);

            if ((!string.IsNullOrWhiteSpace(value)) && (int.TryParse(value, out int intValue)))
            {
                return intValue;
            }

            if (@default == null)
                throw new ConfigurationErrorsException($"Unable to find integer environment variable with key \"{key}\".");

            return @default.Value;
        }

        protected bool GetBoolEnvironmentVariable(string key, bool? @default = null)
        {
            string value = GetEnvironmentVariable(key, false);

            if (string.IsNullOrWhiteSpace(value))
            {
                if (@default == null)
                    throw new ConfigurationErrorsException($"Unable to find boolean environment variable with key \"{key}\".");

                return @default.Value;
            }

            value = value.Trim().ToLowerInvariant();

            return ((value == "true") || (value == "1"));
        }
    }
}