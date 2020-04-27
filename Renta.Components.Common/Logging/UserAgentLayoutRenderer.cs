using NLog.LayoutRenderers;
using Renta.Components.Common.Providers;

namespace Renta.Components.Common.Logging
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