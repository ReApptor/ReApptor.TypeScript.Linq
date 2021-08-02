using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog;
using WeAre.Athenaeum.Common.Configuration;
using WeAre.Athenaeum.Common.Interfaces.ACM;

namespace Renta.Apps.Common.Configuration
{
    public abstract class RentaConfiguration<TConfiguration> : BaseEnvironmentConfiguration<TConfiguration> where TConfiguration : RentaConfiguration<TConfiguration>
    {
        protected RentaConfiguration(IHostEnvironment environment, ILogger<RentaConfiguration<TConfiguration>> logger, ICredentialService credentialService = null)
            : base(environment, logger, credentialService)
        {
        }
    }
}