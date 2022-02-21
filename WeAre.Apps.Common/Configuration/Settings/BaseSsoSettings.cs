using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;

namespace WeAre.Apps.Common.Configuration.Settings
{
    //<out TOptions> where TOptions : class, new()
    public abstract class BaseSsoSettings
    {
        public CookieSecurePolicy SecurePolicy { get; set; } = CookieSecurePolicy.Always;

        public SameSiteMode SameSite { get; set; } = SameSiteMode.Lax;

        public int ExpirationTimeoutInSec { get; set; } = 600;

        public CookieBuilder GetCorrelationCookie()
        {
            return new CookieBuilder
            {
                Expiration = TimeSpan.FromSeconds(ExpirationTimeoutInSec),
                SecurePolicy = SecurePolicy,
                SameSite = SameSite,
                IsEssential = true,
            };
        }

        public Func<RemoteFailureContext, Task> GetOnRemoteFailure(Func<HttpContext, Exception, string, Task> onFailure = null)
        {
            return context =>
            {
                if (onFailure != null)
                {
                    context.HandleResponse();

                    return onFailure(context.HttpContext, context.Failure, context.Properties.RedirectUri);
                }

                return Task.CompletedTask;
            };
        }
    }
}