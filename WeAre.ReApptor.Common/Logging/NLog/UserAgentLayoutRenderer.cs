using NLog.LayoutRenderers;
using WeAre.ReApptor.Common.Providers;

namespace WeAre.ReApptor.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class UserAgentLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.UserAgent;
        }

        /// <summary>
        /// "useragent"
        /// </summary>
        public const string Name = "useragent";
    }
}