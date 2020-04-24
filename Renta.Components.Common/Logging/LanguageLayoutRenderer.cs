using NLog.LayoutRenderers;
using Renta.Components.Common.Providers;

namespace Renta.Components.Common.Logging
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