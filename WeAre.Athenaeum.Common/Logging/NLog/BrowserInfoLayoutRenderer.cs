using DeviceDetectorNET;
using DeviceDetectorNET.Results;
using DeviceDetectorNET.Results.Client;
using NLog.LayoutRenderers;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class BrowserInfoLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            var detector = new DeviceDetector(provider.UserAgent);

            detector.Parse();

            if (detector.IsBot())
            {
                ParseResult<BotMatchResult> botInfo = detector.GetBot();

                if (botInfo.Success)
                {
                    return $"{botInfo.Match?.Name}, {botInfo.Match?.Producer?.Name}|";
                }
            }

            ParseResult<ClientMatchResult> clientInfo = detector.GetClient();
            if (clientInfo.Success)
            {
                ParseResult<OsMatchResult> osInfo = detector.GetOs();
                return $"{clientInfo.Match?.Name}, {clientInfo.Match?.Version}, {osInfo?.Match?.Name}";
            }

            return provider.UserAgent;
        }

        /// <summary>
        /// "browserinfo"
        /// </summary>
        public const string Name = "browserinfo";
    }
}