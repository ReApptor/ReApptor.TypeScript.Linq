using NLog.LayoutRenderers;
using WeAre.ReApptor.Common.Configuration;
using WeAre.ReApptor.Common.Providers;

namespace WeAre.ReApptor.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class CountryLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.Country;
        }

        protected override string GetValue(IEnvironmentConfiguration configuration)
        {
            return configuration.Country;
        }

        /// <summary>
        /// "country"
        /// </summary>
        public const string Name = "country";
    }
}