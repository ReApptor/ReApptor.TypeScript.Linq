using System;
using Microsoft.AspNetCore.Http;
using WeAre.Athenaeum.TemplateApp.Common;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Providers
{
    public static class MobileTokenHelper
    {
        public static void SaveMobileJwt(this HttpContext context, string jwt)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            if (string.IsNullOrWhiteSpace(jwt))
                throw new ArgumentOutOfRangeException(nameof(jwt), "Jwt is whitespace or empty.");

            var options = new CookieOptions {Expires = DateTimeOffset.UtcNow.AddYears(1)};
            
            context
                .Response
                .Cookies
                .Append(TestApplicationConstants.Ui.MobileTokenCookie, jwt, options);
        }

        public static string GetMobileJwt(this HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            if (context.Request.Cookies.TryGetValue(TestApplicationConstants.Ui.MobileTokenCookie, out string jwt))
            {
                return jwt;
            }

            return null;
        }

        public static void ClearMobileJwt(this HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            context
                .Response
                .Cookies
                .Delete(TestApplicationConstants.Ui.MobileTokenCookie);
        }
    }
}