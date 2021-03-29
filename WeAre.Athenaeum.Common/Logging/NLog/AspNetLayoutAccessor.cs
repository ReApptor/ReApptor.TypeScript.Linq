using System;
using System.Text;
using NLog;
using NLog.Web.LayoutRenderers;

namespace WeAre.Athenaeum.Common.Logging.NLog
{
    internal sealed class AspNetLayoutAccessor : AspNetLayoutRendererBase
    {
        public AspNetLayoutAccessor()
        {
            InitializeLayoutRenderer();
        }
        
        protected override void DoAppend(StringBuilder builder, LogEventInfo logEvent)
        {
            throw new NotSupportedException();
        }

        public new void CloseLayoutRenderer()
        {
            base.CloseLayoutRenderer();
        }
    }
}