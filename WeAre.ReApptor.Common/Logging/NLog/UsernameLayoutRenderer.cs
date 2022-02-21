using NLog.LayoutRenderers;
using WeAre.ReApptor.Common.Providers;

namespace WeAre.ReApptor.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class UsernameLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(SecurityProvider provider)
        {
            return provider.CallerUsername;
        }

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