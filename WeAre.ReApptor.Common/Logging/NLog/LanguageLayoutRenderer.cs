using NLog.LayoutRenderers;
using WeAre.ReApptor.Common.Providers;

namespace WeAre.ReApptor.Common.Logging.NLog
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