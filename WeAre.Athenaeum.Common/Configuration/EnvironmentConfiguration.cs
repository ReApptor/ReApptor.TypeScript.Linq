using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace WeAre.Athenaeum.Common.Configuration
{
    public class EnvironmentConfiguration : BaseEnvironmentConfiguration<EnvironmentConfiguration>
    {
        public EnvironmentConfiguration(IWebHostEnvironment environment, ILogger<EnvironmentConfiguration> logger)
            : base(environment, logger)
        {
        }
    }
}