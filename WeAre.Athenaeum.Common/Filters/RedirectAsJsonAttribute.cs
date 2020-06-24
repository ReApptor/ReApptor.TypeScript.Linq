using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace Renta.Tools.Common.Filters
{
    /// <summary>
    /// Convert redirect response (302) to success response (200) with location JSON string ("Location" header)
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public sealed class RedirectAsJsonAttribute : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            ActionExecutedContext result = await next();

            if (result.Result != null)
            {
                await result.Result.ExecuteResultAsync(context);

                HttpResponse response = context.HttpContext.Response;

                if (response.StatusCode == (int)HttpStatusCode.Redirect)
                {
                    const string header = "Location";
                    string location = response.Headers[header];
                    response.Headers.Remove(header);

                    string json = JsonConvert.SerializeObject(location);
                    byte[] data = Encoding.UTF8.GetBytes(json);

                    response.StatusCode = (int)HttpStatusCode.OK;
                    response.ContentType = "application/json";
                    response.ContentLength = data.Length;

                    await response.Body.WriteAsync(data, 0, data.Length);

                    await response.Body.FlushAsync();
                }
            }
        }
    }
}