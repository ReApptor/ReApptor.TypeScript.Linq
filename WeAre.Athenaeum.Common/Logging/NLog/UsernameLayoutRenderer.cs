using NLog.LayoutRenderers;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class UsernameLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.Email;
        }

        /// <summary>
        /// "username"
        /// </summary>
        public const string Name = "username";
    }
}