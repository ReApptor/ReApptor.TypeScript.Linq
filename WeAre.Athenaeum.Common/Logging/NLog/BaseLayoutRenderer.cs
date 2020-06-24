using System;
using System.Text;
using NLog;
using NLog.Web.LayoutRenderers;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    public abstract class BaseLayoutRenderer : AspNetLayoutRendererBase
    {
        protected abstract string GetValue(HttpContextProvider provider);

        protected override void DoAppend(StringBuilder builder, LogEventInfo logEvent)
        {
            HttpContextProvider httpContextProvider = GetHttpContextProvider();
            if (httpContextProvider != null)
            {
                string value = GetValue(httpContextProvider);
                if (!string.IsNullOrWhiteSpace(value))
                {
                    builder.Append(value);
                }
            }
        }

        protected IServiceProvider GetServiceProvider()
        {
            return HttpContextAccessor?.HttpContext?.RequestServices ?? AthenaeumLayoutRenderer.ServiceProvider;
        }

        protected HttpContextProvider GetHttpContextProvider()
        {
            IServiceProvider serviceProvider = GetServiceProvider();
            return serviceProvider.GetService(typeof(HttpContextProvider)) as HttpContextProvider;
        }
    }
}