using System;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace Renta.Toolkit.Extensions
{
    public static class HttpContextExtensions
    {
        #region BrowserId/SessionId

        public static bool SessionAvailable(this HttpContext httpContex)
        {
            try
            {
                ISession session = httpContex?.Session;
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

                    if ((request != null) && (request.Cookies.ContainsKey(RentaConstants.Http.BrowserIdTag)))
                    {
                        return request.Cookies[RentaConstants.Http.BrowserIdTag];
                    }

                    if ((context.SessionAvailable()) && (context.Session.TryGetValue(RentaConstants.Http.BrowserIdTag, out byte[] data)))
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
                    bool newSession = (!context.Session.TryGetValue(RentaConstants.Http.SessionIdTag, out _));
                    if (newSession)
                    {
                        logger?.LogInformation($"New session id \"{context.Session.Id}\" create at \"{DateTime.UtcNow}\".");
                        context.Session.Set(RentaConstants.Http.SessionIdTag, Encoding.UTF8.GetBytes(context.Session.Id));
                    }
                }

                if (!context.Response.HasStarted)
                {
                    bool newBrowser = ((!context.Request.Cookies.ContainsKey(RentaConstants.Http.BrowserIdTag)) &&
                                       ((!sessionAvailable) || ((!context.Session.TryGetValue(RentaConstants.Http.BrowserIdTag, out _)))));
                    if (newBrowser)
                    {
                        string browserId = Guid.NewGuid().ToString("N");
                        logger?.LogInformation($"New browser id \"{browserId}\" generated at \"{DateTime.UtcNow}\".");
                        var options = new CookieOptions { IsEssential = true, Expires = DateTimeOffset.MaxValue };
                        context.Response.Cookies.Append(RentaConstants.Http.BrowserIdTag, browserId, options);
                        if (sessionAvailable)
                        {
                            context.Session.Set(RentaConstants.Http.BrowserIdTag, Encoding.UTF8.GetBytes(browserId));
                        }
                    }
                }
            }
        }

        #endregion
    }
}