using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using WeAre.Athenaeum.TemplateApp.Common;
using WeAre.Athenaeum.TemplateApp.Common.Configuration;
using WeAre.Athenaeum.TemplateApp.WebUI.Server.Models;
using WeAre.Athenaeum.Toolkit.Extensions;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Middlewares
{
    public sealed class ApiExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ApiExceptionMiddleware> _logger;
        private readonly TestApplicationConfiguration _configuration;

        public ApiExceptionMiddleware(RequestDelegate next, ILoggerFactory loggerFactory, TestApplicationConfiguration configuration)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = loggerFactory?.CreateLogger<ApiExceptionMiddleware>() ?? throw new ArgumentNullException(nameof(loggerFactory));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"{nameof(ApiExceptionMiddleware)}. {ex.Message}");
                
                bool handled = await HandleExceptionAsync(context, ex);

                if (!handled)
                {
                    throw;
                }
            }
        }

        private async Task<bool> HandleExceptionAsync(HttpContext context, Exception exception)
        {
            HttpRequest request = context.Request;
            
            bool isAjax = (request.ContentType == TestApplicationConstants.Http.ApiContextType);

            if (!isAjax)
            {
                return false;
            }
            
            string requestId = context.TraceIdentifier;

            string url = request.Path.ToString();

            string traceMessage = (_configuration.IsDevelopment)
                ? $"{nameof(ApiExceptionMiddleware)}. Unhandled exception.\r\nUrl: \"{url}\"\r\n{exception.ToTraceString()}"
                : null;

            _logger.LogError(exception, $"Error occured. RequestId=\"{requestId}\". Url=\"{url}\". Message=\"{exception.Message}\".");

            var error = new ServerError
            {
                RequestId = requestId,
                DebugDetails = traceMessage
            };
                    
            var response = new ResponseContainer
            {
                Error = error
            };
            
            HttpResponse httpResponse = context.Response;
            
            httpResponse.ContentType = TestApplicationConstants.Http.ApiContextType;
            
            context.Response.StatusCode = (int)HttpStatusCode.OK;
            
            var jsonSerializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            
            string responseJson = JsonConvert.SerializeObject(response, jsonSerializerSettings);
            
            await httpResponse.WriteAsync(responseJson);

            return true;
        }
    }

    public static class ApiExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseApiExceptionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ApiExceptionMiddleware>();
        }
    }
}