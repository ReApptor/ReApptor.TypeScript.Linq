using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Web;
using Renta.Toolkit.Logging;
using LogLevel = Microsoft.Extensions.Logging.LogLevel;

namespace Renta.Toolkit.Startup
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

        public static void Start<TStartup>(string[] args) where TStartup : class
        {
            // NLog: setup the logger first to catch all errors
            RentaLayoutRenderer.Register();

            string name = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            Logger logger = name == "DevelopmentVS"
                ? NLogBuilder.ConfigureNLog("nlog.debug.config").GetCurrentClassLogger()
                : NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();

            try
            {
                logger.Info("Program started.");

                IHost host = CreateWebHostBuilder<TStartup>(args).Build();

                RentaLayoutRenderer.ServiceProvider = host.Services;

                host.Run();
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

        public static IHostBuilder CreateWebHostBuilder<TStartup>(string[] args) where TStartup : class
        {
            return  Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<TStartup>();
                })
                .ConfigureAppConfiguration((hostingContext, config) => { config.AddEnvironmentVariables(); })
                .ConfigureRentaLogging();
        }

        public static IHostBuilder ConfigureRentaLogging(this IHostBuilder builder)
        {
            builder = builder?
                .ConfigureLogging(logging =>
                {
                    LogLevel logLevel = GetLogLevel("MICROSOFT_LOGGING_LEVEL");
                    logging.ClearProviders();
                    logging.SetMinimumLevel(logLevel);
                })
                .UseNLog();

            return builder;
        }
    }
}