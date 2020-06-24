using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Renta.Apps.Common.Configuration.Settings;
using WeAre.Athenaeum.Common.Providers;

namespace Renta.Apps.Common.Helpers
{
    public static class RentaSecurityHelper
    {
        public static AuthenticationBuilder AddRentaAuthentication(AuthenticationBuilder builder, string authenticationType)
        {
            return builder.AddAthenaeumAuthentication(authenticationType);
        }

        public static AuthenticationBuilder AddRentaAuthentication(IServiceCollection services, string authenticationType)
        {
            return services.AddAthenaeumAuthentication(authenticationType);
        }

        public static AuthenticationBuilder AddRentaAuthenticationWithSso(IServiceCollection services, IOptions<AzureSsoSettings> settings, string authenticationType)
        {
            return AddRentaAuthentication(
                services
                    .AddAuthentication(options =>
                    {
                        options.DefaultScheme = authenticationType;
                        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    })
                    .AddCookie()
                    .AddMicrosoftAccount(options =>
                    {
                        options.ClientId = settings.Value.ApplicationId;
                        options.ClientSecret = settings.Value.ClientSecret;
                    }),
                authenticationType);
        }
        
        public static IServiceCollection AddRentaSecurityProvider(IServiceCollection services, string authenticationType, string packageConsoleUser = RentaConstants.Db.PackageConsoleUser)
        {
            return services?.AddSecurityProvider(options =>
            {
                options.AuthenticationType = authenticationType;
                options.PackageConsoleUser = packageConsoleUser;
            });
        }
    }
}