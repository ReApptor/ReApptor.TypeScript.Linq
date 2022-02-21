using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace WeAre.ReApptor.Common.Configuration
{
    public class EnvironmentConfiguration : BaseEnvironmentConfiguration<EnvironmentConfiguration>
    {
        public EnvironmentConfiguration(IWebHostEnvironment environment, ILogger<EnvironmentConfiguration> logger)
            : base(environment, logger)
        {
        }
    }
}