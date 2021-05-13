using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
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

        /// <summary>
        /// https://damienbod.com/2019/05/17/updating-microsoft-account-logins-in-asp-net-core-with-openid-connect-and-azure-active-directory/
        /// </summary>
        public static AuthenticationBuilder AddRentaAuthenticationWithSso(IServiceCollection services, IOptions<AzureSsoSettings> settings, string authenticationType, Func<HttpContext, Exception, string, Task> onFailure = null)
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
                        options.Events.OnRemoteFailure = async context =>
                        {
                            if (onFailure != null)
                            {
                                await onFailure(context.HttpContext, context.Failure, context.Properties.RedirectUri);
                                
                                context.HandleResponse();
                            }
                        };
                        options.CorrelationCookie = new CookieBuilder
                        {
                            Expiration = TimeSpan.FromSeconds(settings.Value.ExpirationTimeoutInSec),
                            SecurePolicy = settings.Value.SecurePolicy,
                            SameSite = settings.Value.SameSite,
                            IsEssential = true,
                        };
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