using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using WeAre.ReApptor.Common.Models;

namespace WeAre.ReApptor.Common.Middlewares
{
    public sealed class HttpStatusCodeExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<HttpStatusCodeExceptionMiddleware> _logger;

        public HttpStatusCodeExceptionMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = loggerFactory?.CreateLogger<HttpStatusCodeExceptionMiddleware>() ?? throw new ArgumentNullException(nameof(loggerFactory));
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"HttpStatusCodeException. {ex.Message}");
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = AthenaeumConstants.Http.ApiContextType;

            int statusCode;
            if (ex is UnauthorizedAccessException)
            {
                //401
                statusCode = (int)HttpStatusCode.Unauthorized;
            }
            else if (ex is ArgumentException)
            {
                //400
                statusCode = (int)HttpStatusCode.BadRequest;
            }
            else if (ex is InvalidOperationException)
            {
                //404
                statusCode = (int)HttpStatusCode.NotFound;
            }
            else
            {
                statusCode = 520; //520 Unknown Error
            }

            var errorDetails = new ErrorDetails
            {
                StatusCode = statusCode,
                Exception = ex
            };

            //Status code should not be 50X, because AWS can re-deploy solution in case of multiple errors...
            context.Response.StatusCode = statusCode;

            return context.Response.WriteAsync(errorDetails.ToString());
        }
    }

    public static class HttpStatusCodeExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseHttpStatusCodeExceptionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HttpStatusCodeExceptionMiddleware>();
        }
    }
}