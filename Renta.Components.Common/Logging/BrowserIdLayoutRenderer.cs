using NLog.LayoutRenderers;
using Renta.Components.Common.Providers;

namespace Renta.Components.Common.Logging
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