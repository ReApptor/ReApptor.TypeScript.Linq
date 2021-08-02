using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WeAre.Athenaeum.Common.Helpers;
using WeAre.Athenaeum.Common.Interfaces.ACM;
using WeAre.Athenaeum.Toolkit.Extensions;

namespace WeAre.Athenaeum.Common.Configuration
{
    public abstract class BaseEnvironmentConfiguration<TConfiguration> : IEnvironmentConfiguration where TConfiguration : BaseEnvironmentConfiguration<TConfiguration>
    {
        #region Private/Protected

        private string _version;
        private string _country;

        private static string NormalizeVersion(string version)
        {
            //latest-(2019-10-24-15:45:51-UTC/GMT+0)
            ////(2019-10-24-15:45:51-UTC/GMT+0)
            if (!string.IsNullOrWhiteSpace(version))
            {
                version = version
                    .Replace("(", string.Empty)
                    .Replace(")", string.Empty)
                    .Replace("-UTC/GMT+0", string.Empty);
            }

            return version;
        }

        private static string GetEntryVersion()
        {
            Assembly assembly = Assembly.GetEntryAssembly() ?? typeof(TConfiguration).Assembly;
            Version version = assembly.GetName().Version;
            return version?.ToString() ?? "1.0";
        }

        protected ILogger<BaseEnvironmentConfiguration<TConfiguration>> Logger { get; }

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

        protected string[] GetArrayEnvironmentVariable(string key, string[] @default = null)
        {
            string value = GetEnvironmentVariable(key, false);

            return (!string.IsNullOrWhiteSpace(value))
                ? value
                    .Split(new[] {",", ";"}, StringSplitOptions.RemoveEmptyEntries)
                    .Select(item => item.Trim())
                    .Where(item => !string.IsNullOrWhiteSpace(item))
                    .ToArray()
                : @default ?? new string[0];
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

        protected int? GetNullableIntEnvironmentVariable(string key, int? @default = null)
        {
            string value = GetEnvironmentVariable(key, false);

            if ((!string.IsNullOrWhiteSpace(value)) && (int.TryParse(value, out int intValue)))
            {
                return intValue;
            }

            return @default;
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

        protected BaseEnvironmentConfiguration(IHostEnvironment environment, ILogger<BaseEnvironmentConfiguration<TConfiguration>> logger, ICredentialService credentialService = null)
        {
            HostingEnvironment = environment ?? throw new ArgumentNullException(nameof(environment));
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));

            EnvironmentName = environment.EnvironmentName;
            IsDevelopmentVS = (environment.EnvironmentName == "DevelopmentVS");
            IsDevelopment = (environment.IsDevelopment() || IsDevelopmentVS);
            IsPackageManagerConsole = (IsDevelopment) && (Assembly.GetEntryAssembly()?.GetName().Name == "ef");
            IsLocalEnvironment = ((IsDevelopmentVS) || (IsPackageManagerConsole));

            if (IsLocalEnvironment)
            {
                // Load configuration from file
                string path = Path.Combine(Directory.GetParent(environment.ContentRootPath).FullName, "EnvironmentVariables.json");
                IConfigurationBuilder builder = new ConfigurationBuilder().AddJsonFile(path, false, false);
                IConfigurationRoot config = builder.Build();

                foreach (IConfigurationSection item in config.GetChildren())
                {
                    Environment.SetEnvironmentVariable(item.Key, item.Value);
                }
            }
            else if (credentialService != null)
            {
                //TODO: Implement as a separate 
                PropertyInfo acmSettingsProperty = typeof(TConfiguration).GetAllProperties(typeof(ICredentialServiceSettings)).FirstOrDefault();
                if (acmSettingsProperty?.QuickGetValue(this) is ICredentialServiceSettings acmSettings)
                {
                    string acmSettingsJson = JsonConvert.SerializeObject(acmSettings);
                    Logger.LogInformation($"BaseEnvironmentConfiguration. Initialize ACM. Settings =\"{acmSettingsJson}\".");
                    
                    credentialService.Initialize(acmSettings);
                    IEnumerable<ICredential> credentials = credentialService.ListCredentialsAsync().GetAwaiter().GetResult();

                    credentials = credentials.Where(credential => (!string.IsNullOrWhiteSpace(credential.Key?.Label)) && (!string.IsNullOrWhiteSpace(credential.Value)));

                    foreach (ICredential credential in credentials)
                    {
                        Environment.SetEnvironmentVariable(credential.Key.Label, credential.Value);
                    }
                }
            }

            Instance = this as TConfiguration;
        }

        #endregion

        public static TConfiguration Instance { get; private set; }

        public string EnvironmentName { get; }

        public bool IsDevelopment { get; }

        public bool IsDevelopmentVS { get; }

        public bool IsPackageManagerConsole { get; }

        public bool IsLocalEnvironment { get; }

        public bool IsCloudEnvironment => !IsLocalEnvironment;

        public virtual IHostEnvironment HostingEnvironment { get; }

        public bool IsDebug
        {
            get
            {
#if DEBUG
                return true;
#else
                return false;
#endif
            }
        }

        public virtual string Version
        {
            get { return _version ??= NormalizeVersion(GetEnvironmentVariable("VERSION", GetEntryVersion())); }
        }

        public virtual string Country
        {
            get { return _country ??= GetEnvironmentVariable("COUNTRY", CountryHelper.DefaultCountry.Code); }
        }

        public bool IsSweden => Country.IsCountry("se");

        public bool IsFinland => Country.IsCountry("fi");

        public bool IsDenmark => Country.IsCountry("da");

        public bool IsPoland => Country.IsCountry("pl");

        public bool IsNorway => Country.IsCountry("nor") || Country.IsCountry("no");
    }
}