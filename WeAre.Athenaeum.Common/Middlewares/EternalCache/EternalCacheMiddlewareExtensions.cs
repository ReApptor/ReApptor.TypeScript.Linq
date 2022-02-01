using Microsoft.AspNetCore.Builder;

namespace WeAre.Athenaeum.Common.Middlewares.EternalCache
{
    public static class EternalCacheMiddlewareExtensions
    {
        public static IApplicationBuilder UseEternalCache(this IApplicationBuilder app, EternalCacheMiddlewareOptions options)
        {
            return app.UseMiddleware<EternalCacheMiddleware>(options);
        }

        public static IApplicationBuilder UseEternalCache(this IApplicationBuilder app, string route)
        {
            var options = new EternalCacheMiddlewareOptions { Route = route };
            return app.UseEternalCache(options);
        }
    }
}