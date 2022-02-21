using NLog.LayoutRenderers;
using WeAre.ReApptor.Common.Providers;

namespace WeAre.ReApptor.Common.Logging.NLog
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