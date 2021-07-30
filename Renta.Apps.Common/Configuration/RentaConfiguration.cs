using Microsoft.Extensions.Hosting;
using WeAre.Athenaeum.Common.Configuration;
using WeAre.Athenaeum.Common.Interfaces.ACM;

namespace Renta.Apps.Common.Configuration
{
    public abstract class RentaConfiguration<TConfiguration> : BaseEnvironmentConfiguration<TConfiguration> where TConfiguration : RentaConfiguration<TConfiguration>
    {
        protected RentaConfiguration(IHostEnvironment environment, ICredentialService credentialService = null)
            : base(environment, credentialService)
        {
        }
    }
}