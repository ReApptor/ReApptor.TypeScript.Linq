using Microsoft.Extensions.Hosting;

namespace WeAre.ReApptor.Common.Configuration
{
    public interface IEnvironmentConfiguration
    {
        string EnvironmentName { get; }

        bool IsDevelopment { get; }

        bool IsDevelopmentVS { get; }

        bool IsPackageManagerConsole { get; }
        
        bool IsDebug { get; }
        
        IHostEnvironment HostingEnvironment { get; }
        
        string Version { get; }
        
        string Country { get; }
    }
}