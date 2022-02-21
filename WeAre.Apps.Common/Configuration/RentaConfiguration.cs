using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using WeAre.ReApptor.Common.Configuration;
using WeAre.ReApptor.Common.Interfaces.ACM;

namespace WeAre.Apps.Common.Configuration
{
    public abstract class RentaConfiguration<TConfiguration> : BaseEnvironmentConfiguration<TConfiguration> where TConfiguration : RentaConfiguration<TConfiguration>
    {
        protected RentaConfiguration(IHostEnvironment environment, ILogger<RentaConfiguration<TConfiguration>> logger, ICredentialService credentialService = null)
            : base(environment, logger, credentialService)
        {
        }
    }
}