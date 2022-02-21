using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Net.Http.Headers;

namespace WeAre.ReApptor.Common.Middlewares.EternalCache
{
    public sealed class EternalCacheMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly EternalCacheMiddlewareOptions _options;

        public EternalCacheMiddleware(RequestDelegate next, EternalCacheMiddlewareOptions options)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _options = options ?? throw new ArgumentNullException(nameof(options));

            if (string.IsNullOrWhiteSpace(options.Route))
                throw new ArgumentOutOfRangeException(nameof(options), "Cache control route is not specified.");
        }

        public async Task Invoke(HttpContext context)
        {
            if (context != null)
            {
                string path = context.Request?.Path;

                if ((!string.IsNullOrWhiteSpace(path)) && (path.Contains(Route, StringComparison.InvariantCultureIgnoreCase)))
                {
                    const int days = 365;
                    DateTimeOffset utcNow = DateTimeOffset.UtcNow;

                    ResponseHeaders headers = context.Response.GetTypedHeaders();
                    headers.CacheControl = new CacheControlHeaderValue
                    {
                        Public = true,
                        MaxAge = TimeSpan.FromDays(days)
                    };
                    headers.Expires = utcNow.Date.AddDays(days);
                    headers.LastModified = utcNow;

                    context.Response.Headers.Remove("Pragma");
                }
            }

            await _next(context);
        }

        public string Route => _options.Route;
    }
}