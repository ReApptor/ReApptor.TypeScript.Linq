﻿using System;
using System.Text;
using NLog;
using NLog.Web.LayoutRenderers;
using WeAre.Athenaeum.Common.Configuration;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    public abstract class BaseLayoutRenderer : AspNetLayoutRendererBase
    {
        protected abstract string GetValue(HttpContextProvider provider);

        protected virtual string GetValue(IEnvironmentConfiguration configuration)
        {
            return null;
        }

        protected override void DoAppend(StringBuilder builder, LogEventInfo logEvent)
        {
            string value = null;

            HttpContextProvider httpContextProvider = GetHttpContextProvider();
            if (httpContextProvider != null)
            {
                value = GetValue(httpContextProvider);
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

        protected IServiceProvider GetServiceProvider()
        {
            return AthenaeumLayoutRenderer.ServiceProvider ?? HttpContextAccessor?.HttpContext?.RequestServices;
        }

        protected HttpContextProvider GetHttpContextProvider()
        {
            IServiceProvider serviceProvider = GetServiceProvider();
            return serviceProvider.GetService(typeof(HttpContextProvider)) as HttpContextProvider;
        }

        protected IEnvironmentConfiguration GetEnvironmentConfiguration()
        {
            IServiceProvider serviceProvider = GetServiceProvider();
            return serviceProvider.GetService(typeof(IEnvironmentConfiguration)) as IEnvironmentConfiguration;
        }
    }
}