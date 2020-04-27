using DeviceDetectorNET;
using DeviceDetectorNET.Results;
using DeviceDetectorNET.Results.Client;
using NLog.LayoutRenderers;
using Renta.Components.Common.Providers;

namespace Renta.Components.Common.Logging
{
    [LayoutRenderer(Name)]
    public sealed class BrowserInfoLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            var dd = new DeviceDetector(provider.UserAgent);
            dd.Parse();
            if(dd.IsBot()) {
                ParseResult<BotMatchResult> botInfo = dd.GetBot();
                if (botInfo.Success)
                {
                    return $"{botInfo.Match?.Name}, {botInfo.Match?.Producer?.Name}|";
                }
            }
            
            ParseResult<ClientMatchResult> clientInfo = dd.GetClient(); 
            if (clientInfo.Success)
            {
                ParseResult<OsMatchResult> osInfo = dd.GetOs();
                return $"{clientInfo.Match?.Name}, {clientInfo.Match?.Version}, {osInfo?.Match?.Name}";
            }
            return provider.UserAgent;
        }

        /// <summary>
        /// "useragent"
        /// </summary>
        public const string Name = "browserinfo";
    }
}