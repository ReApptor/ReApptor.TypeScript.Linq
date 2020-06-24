using Microsoft.Extensions.Logging;
using WeAre.Athenaeum.Common.Configuration;

namespace WeAre.Athenaeum.Common.Helpers
{
    public static class StartupHelper
    {
        public static void LogEnvironmentInformation(this ILogger logger, IEnvironmentConfiguration config)
        {
            if ((logger != null) && (config != null))
            {
                string message = $"Environment. Name=\"{config.EnvironmentName}\", IsDevelopment=\"{config.IsDevelopment}\", IsDevelopmentVS=\"{config.IsDevelopmentVS}\", IsPackageManagerConsole=\"{config.IsPackageManagerConsole}\", IsDebug=\"{config.IsDebug}\".";
                logger.LogInformation(message);
            }
        }
    }
}