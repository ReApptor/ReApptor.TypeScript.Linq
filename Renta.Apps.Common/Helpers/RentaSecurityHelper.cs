using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
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
        public static AuthenticationBuilder AddRentaAuthenticationWithSso(IServiceCollection services,
            IOptions<AzureSsoSettings> settings,
            string authenticationType,
            Func<HttpContext, Exception, string, Task> onFailure = null
        )
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
                        options.Events.OnRemoteFailure = settings.Value.GetOnRemoteFailure(onFailure);
                        options.CorrelationCookie = settings.Value.GetCorrelationCookie();
                    }),
                authenticationType);
        }


        public static AuthenticationBuilder AddRentaAuthenticationWithSignicatSso(
            IServiceCollection services,
            IOptions<SignicatSsoSettings> settings,
            string authenticationType,
            Func<AuthorizationCodeReceivedContext, Task> signicatRedeemAuthorizationCodeAsync,
            Func<HttpContext, Exception, string, Task> onFailure = null)
        {
            AuthenticationBuilder builder = AddRentaAuthentication(services
                .AddAuthentication(options =>
                {
                    options.DefaultScheme = authenticationType;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddCookie(), authenticationType);


            return builder.AddOpenIdConnect("Signicat", options =>
            {
                options.Events.OnAuthorizationCodeReceived = signicatRedeemAuthorizationCodeAsync;

                options.Authority = settings.Value.Authority;
                options.CallbackPath = settings.Value.CallbackPath;

                options.ClientId = settings.Value.ClientId;
                options.ClientSecret = settings.Value.ClientSecret;
                options.ResponseType = "code";

                foreach (var scope in settings.Value.Scopes)
                {
                    options.Scope.Add(scope);
                }

                options.GetClaimsFromUserInfoEndpoint = true;

                options.Events = new OpenIdConnectEvents
                {
                    OnRedirectToIdentityProvider = context =>
                    {
                        context.ProtocolMessage.SetParameter("signicat_profile", settings.Value.GraphicalProfile);
                        context.ProtocolMessage.SetParameter("acr_values", settings.Value.AcrValues);
                        return Task.FromResult(0);
                    },
                    OnRemoteFailure = settings.Value.GetOnRemoteFailure(onFailure)
                };

                options.CorrelationCookie = settings.Value.GetCorrelationCookie();
                options.SaveTokens = true;
            });
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