using System.Text;
using NLog;
using NLog.LayoutRenderers;
using WeAre.Athenaeum.Common.Configuration;
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

        protected override string GetValue(IEnvironmentConfiguration configuration)
        {
            return configuration.Country;
        }
        
        protected override void DoAppend(StringBuilder builder, LogEventInfo logEvent)
        {
            string value = null;

            HttpContextProvider httpContextProvider = GetHttpContextProvider();
            if (httpContextProvider != null)
            {
                value = GetValue(httpContextProvider);
            }

            if (string.IsNullOrWhiteSpace(value))
            {
                IEnvironmentConfiguration configuration = GetEnvironmentConfiguration();
                if (configuration != null)
                {
                    value = GetValue(configuration);
                }
            }
            
            builder.Append($"Country={value};httpContextProvider={httpContextProvider!=null};configuration={GetEnvironmentConfiguration()!=null}");
        }

        /// <summary>
        /// "country"
        /// </summary>
        public const string Name = "country";
    }
}