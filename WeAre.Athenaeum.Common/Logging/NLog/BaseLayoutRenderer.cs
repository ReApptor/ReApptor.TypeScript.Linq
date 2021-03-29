using System;
using System.Text;
using Microsoft.AspNetCore.Http;
using NLog;
using NLog.LayoutRenderers;
using WeAre.Athenaeum.Common.Configuration;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    public abstract class BaseLayoutRenderer : LayoutRenderer //AspNetLayoutRendererBase
    {
        private AspNetLayoutAccessor _accessor;
        
        protected virtual string GetValue(HttpContextProvider provider)
        {
            return null;
        }
        
        protected virtual string GetValue(SecurityProvider provider)
        {
            return null;
        }

        protected virtual string GetValue(IEnvironmentConfiguration configuration)
        {
            return null;
        }

        protected override void Append(StringBuilder builder, LogEventInfo logEvent)
        //protected override void DoAppend(StringBuilder builder, LogEventInfo logEvent)
        {
            string value = null;
            
            HttpContextProvider httpContextProvider = GetHttpContextProvider();
            if (httpContextProvider != null)
            {
                value = GetValue(httpContextProvider);
            }

            if (string.IsNullOrWhiteSpace(value))
            {
                SecurityProvider securityProvider = GetSecurityProvider();
                if (securityProvider != null)
                {
                    value = GetValue(securityProvider);
                }
            }

            if (string.IsNullOrWhiteSpace(value))
            {
                IEnvironmentConfiguration configuration = GetEnvironmentConfiguration();
                if (configuration != null)
                {
                    value = GetValue(configuration);
                }
            }
            
            if (!string.IsNullOrWhiteSpace(value))
            {
                builder.Append(value);
            }
        }

        protected override void CloseLayoutRenderer()
        {
            _accessor?.CloseLayoutRenderer();
            _accessor = null;
            base.CloseLayoutRenderer();
        }

        protected IHttpContextAccessor HttpContextAccessor
        {
            get { return (_accessor ??= new AspNetLayoutAccessor()).HttpContextAccessor; }
        }

        protected IServiceProvider GetServiceProvider()
        {
            return AthenaeumLayoutRenderer.ServiceProvider ?? HttpContextAccessor?.HttpContext?.RequestServices;
        }

        protected SecurityProvider GetSecurityProvider()
        {
            IServiceProvider serviceProvider = GetServiceProvider();
            return serviceProvider?.GetService(typeof(SecurityProvider)) as SecurityProvider;
        }

        protected HttpContextProvider GetHttpContextProvider()
        {
            IServiceProvider serviceProvider = GetServiceProvider();
            return serviceProvider?.GetService(typeof(HttpContextProvider)) as HttpContextProvider;
        }

        protected IEnvironmentConfiguration GetEnvironmentConfiguration()
        {
            IServiceProvider serviceProvider = GetServiceProvider();
            return serviceProvider?.GetService(typeof(IEnvironmentConfiguration)) as IEnvironmentConfiguration;
        }
    }
}