using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace WeAre.Athenaeum.Common.Middlewares
{
    [DebuggerStepThrough]
    public sealed class XForwardedRequestMiddleware
    {
        private readonly RequestDelegate _next;

        public XForwardedRequestMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            bool isHttp = (context.Request.Scheme == "http");
            var forwarded = (isHttp) && ((context.Request.Headers["X-Forwarded-Proto"] == "https") ||
                                         (context.Request.Headers["X-Forwarded-Port"] == "443"));
            if (forwarded)
            {
                context.Request.Scheme = "https";
            }
            
            await _next(context);
        }
    }
}