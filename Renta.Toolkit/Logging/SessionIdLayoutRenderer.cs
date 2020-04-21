﻿using System.Text;
using NLog;
using NLog.LayoutRenderers;
 using Renta.Toolkit.Logging;
 using Renta.Toolkit.Providers;

 namespace Renta.Toolkit.Logging
{
    [LayoutRenderer(Name)]
    public sealed class SessionIdLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.SessionId;
        }

        /// <summary>
        /// "sessionid"
        /// </summary>
        public const string Name = "sessionid";
    }
}