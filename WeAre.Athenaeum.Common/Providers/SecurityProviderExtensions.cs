using System;
using Microsoft.Extensions.DependencyInjection;

namespace WeAre.Athenaeum.Common.Providers
{
    public static class SecurityProviderExtensions
    {
        public static IServiceCollection AddSecurityProvider(this IServiceCollection services, Action<SecurityProviderOptions> securityProviderBuilder = null)
        {
            return services?.AddSecurityProvider<SecurityProvider>(securityProviderBuilder);
        }
        
        public static IServiceCollection AddSecurityProvider<TSecurityProvider>(this IServiceCollection services, Action<SecurityProviderOptions> securityProviderBuilder = null) where TSecurityProvider : SecurityProvider
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));
            
            securityProviderBuilder?.Invoke(SecurityProvider.Options);

            return services
                .AddScoped<TSecurityProvider>()
                .AddScoped<SecurityProvider, TSecurityProvider>()
                .AddScoped<ISecurityProvider, TSecurityProvider>();
        }
    }
}