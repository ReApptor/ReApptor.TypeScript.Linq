using System;
using System.Configuration;
using System.IO;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using WeAre.Athenaeum.Common.Helpers;

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

        protected BaseEnvironmentConfiguration(IHostEnvironment environment)
        {
            HostingEnvironment = environment ?? throw new ArgumentNullException(nameof(environment));

            EnvironmentName = environment.EnvironmentName;
            IsDevelopmentVS = (environment.EnvironmentName == "DevelopmentVS");
            IsDevelopment = (environment.IsDevelopment() || IsDevelopmentVS);
            IsPackageManagerConsole = (IsDevelopment) && (Assembly.GetEntryAssembly()?.GetName().Name == "ef");

            if ((IsDevelopmentVS) || (IsPackageManagerConsole))
            {
                //Load configuration from file
                string path = Path.Combine(Directory.GetParent(environment.ContentRootPath).FullName, "EnvironmentVariables.json");
                IConfigurationBuilder builder = new ConfigurationBuilder().AddJsonFile(path, false, false);
                IConfigurationRoot config = builder.Build();
                
                foreach (IConfigurationSection item in config.GetChildren())
                {
                    Environment.SetEnvironmentVariable(item.Key, item.Value);
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

        public bool IsNorway => Country.IsCountry("nor");
        
        public bool IsDenmark => Country.IsCountry("da");
        
        public bool IsPoland => Country.IsCountry("pl");
    }
}