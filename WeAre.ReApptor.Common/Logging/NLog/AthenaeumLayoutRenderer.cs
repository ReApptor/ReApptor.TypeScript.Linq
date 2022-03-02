using System;
using NLog.LayoutRenderers;

namespace WeAre.ReApptor.Common.Logging.NLog
{
    public static class AthenaeumLayoutRenderer
    {
        public static void Register()
        {
            LayoutRenderer.Register(NLogLayoutRenderer.Name, typeof(NLogLayoutRenderer));
            LayoutRenderer.Register(UserAgentLayoutRenderer.Name, typeof(UserAgentLayoutRenderer));
            LayoutRenderer.Register(SessionIdLayoutRenderer.Name, typeof(SessionIdLayoutRenderer));
            LayoutRenderer.Register(BrowserIdLayoutRenderer.Name, typeof(BrowserIdLayoutRenderer));
            LayoutRenderer.Register(UsernameLayoutRenderer.Name, typeof(UsernameLayoutRenderer));
            LayoutRenderer.Register(LanguageLayoutRenderer.Name, typeof(LanguageLayoutRenderer));
            LayoutRenderer.Register(CountryLayoutRenderer.Name, typeof(CountryLayoutRenderer));
        }

        public static IServiceProvider ServiceProvider { get; internal set; }
    }
}