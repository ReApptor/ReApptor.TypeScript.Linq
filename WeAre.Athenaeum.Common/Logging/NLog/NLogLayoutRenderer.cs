using System.Text;
using NLog;
using NLog.LayoutRenderers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    [LayoutRenderer(Name)]
    public sealed class NLogLayoutRenderer : LayoutRenderer
    {
        protected override void Append(StringBuilder builder, LogEventInfo logEvent)
        {
            builder.Append(Name);
        }

        /// <summary>
        /// "nlog"
        /// </summary>
        public const string Name = "nlog";
    }
}