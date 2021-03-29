using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Web;
using WeAre.Athenaeum.Common.Logging.NLog;
using LogLevel = Microsoft.Extensions.Logging.LogLevel;

namespace WeAre.Athenaeum.Common.Helpers
{
    public static class ProgramHelper
    {
        private static LogLevel GetLogLevel(string key)
        {
            string value = Environment.GetEnvironmentVariable(key);

            if (!string.IsNullOrWhiteSpace(value))
            {
                switch (value)
                {
                    case "Information":
                        return LogLevel.Information;

                    case "Error":
                        return LogLevel.Error;

                    case "Debug":
                        return LogLevel.Debug;

                    case "Critical":
                        return LogLevel.Critical;

                    case "None":
                        return LogLevel.None;

                    case "Trace":
                        return LogLevel.Trace;

                    case "Warning":
                        return LogLevel.Warning;
                }
            }

            return LogLevel.Information;
        }
        
        private static void ConfigureLogging(this ILoggingBuilder builder)
        {
            LogLevel logLevel = GetLogLevel("MICROSOFT_LOGGING_LEVEL");
            builder.ClearProviders();
            builder.SetMinimumLevel(logLevel);
        }

        public static void Start<TStartup>(string[] args, bool web = true) where TStartup : class
        {
            // NLog: setup the logger first to catch all errors
            AthenaeumLayoutRenderer.Register();

            string name = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            Logger logger = (name == "DevelopmentVS")
                ? NLogBuilder.ConfigureNLog("nlog.debug.config").GetCurrentClassLogger()
                : NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();

            try
            {
                logger.Info($"Program started. Web=\"{web}\". Environment=\"{name}\".");

                if (web)
                {
                    IWebHost host = CreateWebHostBuilder<TStartup>(args).Build();
                
                    AthenaeumLayoutRenderer.ServiceProvider = host.Services;
                
                    host.Run();
                }
                else
                {
                    IHost host = CreateHostBuilder<TStartup>(args).Build();
                
                    AthenaeumLayoutRenderer.ServiceProvider = host.Services;
                
                    host.Run();
                }
            }
            catch (Exception ex)
            {
                //NLog: catch setup errors
                logger.Error(ex, $"Stopped program because of exception. {ex.Message}");
                throw;
            }
            finally
            {
                // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
                LogManager.Shutdown();
            }
        }

        public static IHostBuilder CreateHostBuilder<TStartup>(string[] args) where TStartup : class
        {
            return Host
                .CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<TStartup>(); })
                .ConfigureAppConfiguration((hostingContext, config) => { config.AddEnvironmentVariables(); })
                .ConfigureLogging();
        }

        public static IWebHostBuilder CreateWebHostBuilder<TStartup>(string[] args) where TStartup : class
        {
            return WebHost
                .CreateDefaultBuilder(args)
                .UseStartup<TStartup>()
                .ConfigureAppConfiguration((hostingContext, config) => { config.AddEnvironmentVariables(); })
                .ConfigureLogging();
        }

        public static IWebHostBuilder ConfigureLogging(this IWebHostBuilder builder)
        {
            return builder?
                .ConfigureLogging(ConfigureLogging)
                .UseNLog();
        }

        public static IHostBuilder ConfigureLogging(this IHostBuilder builder)
        {
            return builder?
                .ConfigureLogging(ConfigureLogging)
                .UseNLog();
        }
    }
}