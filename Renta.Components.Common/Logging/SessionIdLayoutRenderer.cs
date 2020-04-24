using NLog.LayoutRenderers;
using Renta.Components.Common.Providers;

namespace Renta.Components.Common.Logging
{
    [LayoutRenderer(Name)]
    public sealed class SessionIdLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.SessionId;
        }

        /// <summary>
        /// "sessionid"
        /// </summary>
        public const string Name = "sessionid";
    }
}