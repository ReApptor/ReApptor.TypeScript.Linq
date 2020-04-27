using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Renta.Components.Common.Extensions;

namespace Renta.Components.Common.Providers
{
    public class RentaAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly ILoggerFactory _loggerFactory;
        private readonly HttpContextProvider _httpContextProvider;

        public RentaAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory loggerFactory,
            UrlEncoder encoder,
            ISystemClock clock,
            HttpContextProvider httpContextProvider)
            : base(options, loggerFactory, encoder, clock)
        {
            _loggerFactory = loggerFactory ?? throw new ArgumentNullException(nameof(loggerFactory));
            _httpContextProvider = httpContextProvider ?? throw new ArgumentNullException(nameof(httpContextProvider));
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            ILogger logger = _loggerFactory.CreateLogger(GetType());

            Context.InitializeBrowserInfo(logger);

            IEnumerable<Claim> claims = _httpContextProvider.GetClaims();

            ClaimsPrincipal user = SecurityProvider.GetPrincipal(claims);

            var ticket = new AuthenticationTicket(user, Scheme.Name);

            AuthenticateResult result = AuthenticateResult.Success(ticket);

            return await Task.FromResult(result);
        }
    }

    public static class RentaAuthenticationHandlerExtensions
    {
        public static AuthenticationBuilder AddRentaAuthenticationScheme(this AuthenticationBuilder builder)
        {
            return builder.AddScheme<AuthenticationSchemeOptions, RentaAuthenticationHandler>(RentaConstants.AuthenticationType, null);
        }

        public static AuthenticationBuilder AddRentaAuthentication(this IServiceCollection services)
        {
            return services
                .AddAuthentication(options => { options.DefaultScheme = RentaConstants.AuthenticationType; })
                .AddRentaAuthenticationScheme();
        }

        // public static AuthenticationBuilder AddRentaAuthenticationWithSso(this IServiceCollection services, RentaConfiguration configuration)
        // {
        //     return services
        //         .AddAuthentication(options =>
        //         {
        //             options.DefaultScheme = RentaConstants.AuthenticationType;
        //             options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        //         })
        //         .AddCookie()
        //         .AddMicrosoftAccount(options =>
        //         {
        //             options.ClientId = configuration.AzureSsoSettings.ApplicationId;
        //             options.ClientSecret = configuration.AzureSsoSettings.ClientSecret;
        //         })
        //         .AddRentaAuthenticationScheme();
        // }
    }
}