using System;
using NLog.LayoutRenderers;

namespace Renta.Toolkit.Logging
{
    public static class RentaLayoutRenderer
    {
        public static void Register()
        {
            LayoutRenderer.Register(UserAgentLayoutRenderer.Name, typeof(UserAgentLayoutRenderer));
            LayoutRenderer.Register(SessionIdLayoutRenderer.Name, typeof(SessionIdLayoutRenderer));
            LayoutRenderer.Register(BrowserIdLayoutRenderer.Name, typeof(BrowserIdLayoutRenderer));
            LayoutRenderer.Register(UsernameLayoutRenderer.Name, typeof(UsernameLayoutRenderer));
            LayoutRenderer.Register(LanguageLayoutRenderer.Name, typeof(LanguageLayoutRenderer));
            LayoutRenderer.Register(CountryLayoutRenderer.Name, typeof(CountryLayoutRenderer));
            LayoutRenderer.Register(BrowserInfoLayoutRenderer.Name, typeof(BrowserInfoLayoutRenderer));

        }

        public static IServiceProvider ServiceProvider { get; set; }
    }
}