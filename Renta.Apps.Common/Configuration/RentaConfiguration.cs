using Microsoft.Extensions.Hosting;
using WeAre.Athenaeum.Common.Configuration;

namespace Renta.Apps.Common.Configuration
{
    public abstract class RentaConfiguration<TConfiguration> : BaseEnvironmentConfiguration<TConfiguration> where TConfiguration : RentaConfiguration<TConfiguration>
    {
        protected RentaConfiguration(IHostEnvironment environment)
            : base(environment)
        {
        }
    }
}