using Microsoft.AspNetCore.Hosting;

namespace WeAre.Athenaeum.Common.Configuration
{
    public class EnvironmentConfiguration : BaseEnvironmentConfiguration<EnvironmentConfiguration>
    {
        public EnvironmentConfiguration(IWebHostEnvironment environment)
            : base(environment)
        {
        }
    }
}