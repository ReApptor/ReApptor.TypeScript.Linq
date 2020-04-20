using System;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Renta.Toolkit.Configuration
{
    public abstract class RentaConfiguration : EnvironmentConfiguration
    {
        private string _version;

        public RentaConfiguration(IHostingEnvironment environment)
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

            Instance = this;
        }
        
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
            Assembly assembly = Assembly.GetEntryAssembly() ?? typeof(RentaConfiguration).Assembly;
            return assembly.GetName().Version.ToString();
        }
        
        public static RentaConfiguration Instance { get; private set; }
        
        public string EnvironmentName { get; }

        public bool IsDevelopment { get; }

        public bool IsDevelopmentVS { get; }

        public bool IsPackageManagerConsole { get; }
        
        public IHostingEnvironment HostingEnvironment { get; }
        
        public string Version
        {
            get { return _version ??= NormalizeVersion(GetEnvironmentVariable("VERSION", GetEntryVersion())); }
        }
    }
}