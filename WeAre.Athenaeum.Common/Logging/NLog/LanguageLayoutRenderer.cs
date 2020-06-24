using NLog.LayoutRenderers;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class LanguageLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.Language;
        }

        /// <summary>
        /// "language"
        /// </summary>
        public const string Name = "language";
    }
}