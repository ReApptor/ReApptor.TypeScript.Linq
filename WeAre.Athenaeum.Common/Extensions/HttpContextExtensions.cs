using System;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace WeAre.Athenaeum.Common.Extensions
{
    public static class HttpContextExtensions
    {
        #region BrowserId/SessionId

        public static bool SessionAvailable(this HttpContext httpContext)
        {
            try
            {
                ISession session = httpContext?.Session;
                return (session != null) && (!string.IsNullOrWhiteSpace(session.Id));
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static string UserAgent(this HttpContext context)
        {
            try
            {
                HttpRequest request = context?.Request;

                if ((request != null) && (request.Headers.TryGetValue("User-Agent", out StringValues userAgentValue)))
                {
                    return userAgentValue.ToString();
                }
            }
            catch (InvalidOperationException)
            {
            }

            return null;
        }

        public static string SessionId(this HttpContext context)
        {
            return (context.SessionAvailable()) ? context?.Session?.Id : null;
        }

        public static string BrowserId(this HttpContext context)
        {
            try
            {
                if (context != null)
                {
                    HttpRequest request = context.Request;

                    if ((request != null) && (request.Cookies.ContainsKey(AthenaeumConstants.Http.BrowserIdTag)))
                    {
                        return request.Cookies[AthenaeumConstants.Http.BrowserIdTag];
                    }

                    if ((context.SessionAvailable()) && (context.Session.TryGetValue(AthenaeumConstants.Http.BrowserIdTag, out byte[] data)))
                    {
                        return Encoding.UTF8.GetString(data);
                    }
                }
            }
            catch (InvalidOperationException)
            {
            }

            return null;
        }

        public static void InitializeBrowserInfo(this HttpContext context, ILogger logger)
        {
            if (context?.Request != null && (context.Response != null))
            {
                bool sessionAvailable = (context.SessionAvailable());

                if (sessionAvailable)
                {
                    bool newSession = (!context.Session.TryGetValue(AthenaeumConstants.Http.SessionIdTag, out _));
                    if (newSession)
                    {
                        logger?.LogInformation($"New session id \"{context.Session.Id}\" create at \"{DateTime.UtcNow}\".");
                        context.Session.Set(AthenaeumConstants.Http.SessionIdTag, Encoding.UTF8.GetBytes(context.Session.Id));
                    }
                }

                if (!context.Response.HasStarted)
                {
                    bool newBrowser = ((!context.Request.Cookies.ContainsKey(AthenaeumConstants.Http.BrowserIdTag)) &&
                                       ((!sessionAvailable) || ((!context.Session.TryGetValue(AthenaeumConstants.Http.BrowserIdTag, out _)))));
                    if (newBrowser)
                    {
                        string browserId = Guid.NewGuid().ToString("N");
                        logger?.LogInformation($"New browser id \"{browserId}\" generated at \"{DateTime.UtcNow}\".");
                        var options = new CookieOptions { IsEssential = true, Expires = DateTimeOffset.MaxValue };
                        context.Response.Cookies.Append(AthenaeumConstants.Http.BrowserIdTag, browserId, options);
                        if (sessionAvailable)
                        {
                            context.Session.Set(AthenaeumConstants.Http.BrowserIdTag, Encoding.UTF8.GetBytes(browserId));
                        }
                    }
                }
            }
        }

        #endregion
    }
}