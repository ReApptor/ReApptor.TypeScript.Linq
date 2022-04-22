using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace WeAre.ReApptor.Common.Middlewares
{
    public sealed class DisableNoContentStatusCodeMiddleware
    {
        private readonly RequestDelegate _next;

        public DisableNoContentStatusCodeMiddleware(RequestDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
        }

        public async Task Invoke(HttpContext context)
        {
            await _next(context);

            if (context.Response.StatusCode == (int)HttpStatusCode.NoContent)
            {
                context.Response.StatusCode = (int)HttpStatusCode.OK;
            }
        }
    }

    public static class DisableNoContentStatusCodeMiddlewareExtensions
    {
        /// <summary>
        /// Replace "204" response status code ("NoContent") to "200" ("OK")
        /// </summary>
        public static IApplicationBuilder UseDisableNoContentStatusCodeMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<DisableNoContentStatusCodeMiddleware>();
        }
    }
}