using NLog.LayoutRenderers;
using WeAre.ReApptor.Common.Providers;

namespace WeAre.ReApptor.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class BrowserIdLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.BrowserId;
        }

        /// <summary>
        /// "browserid"
        /// </summary>
        public const string Name = "browserid";
    }
}