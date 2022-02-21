using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WeAre.ReApptor.Common.Extensions;

namespace WeAre.ReApptor.Common.Providers
{
    public class AthenaeumAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly ILoggerFactory _loggerFactory;
        private readonly HttpContextProvider _httpContextProvider;

        public AthenaeumAuthenticationHandler(
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

    public static class AthenaeumAuthenticationHandlerExtensions
    {
        public static AuthenticationBuilder AddAthenaeumAuthentication(this AuthenticationBuilder builder, string authenticationScheme = AthenaeumConstants.AuthenticationType)
        {
            return builder.AddScheme<AuthenticationSchemeOptions, AthenaeumAuthenticationHandler>(authenticationScheme, null);
        }

        public static AuthenticationBuilder AddAthenaeumAuthentication(this IServiceCollection services, string authenticationScheme = AthenaeumConstants.AuthenticationType)
        {
            return services
                .AddAuthentication(options => { options.DefaultScheme = authenticationScheme; })
                .AddAthenaeumAuthentication(authenticationScheme);
        }
    }
}