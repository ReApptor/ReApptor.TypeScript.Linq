using NLog.LayoutRenderers;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class CountryLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.Country;
        }

        /// <summary>
        /// "country"
        /// </summary>
        public const string Name = "country";
    }
}