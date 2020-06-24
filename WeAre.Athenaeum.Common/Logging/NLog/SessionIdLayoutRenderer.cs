using NLog.LayoutRenderers;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
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