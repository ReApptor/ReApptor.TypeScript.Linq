using System.Text;
using NLog;
using NLog.LayoutRenderers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class LoggerLayoutRenderer : LayoutRenderer
    {
        protected override void Append(StringBuilder builder, LogEventInfo logEvent)
        {
            builder.Append("NLog");
        }

        /// <summary>
        /// "logger"
        /// </summary>
        public const string Name = "logger";
    }
}