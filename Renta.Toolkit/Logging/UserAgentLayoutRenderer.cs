﻿using System.Text;
using NLog;
using NLog.LayoutRenderers;
 using Renta.Toolkit.Logging;
 using Renta.Toolkit.Providers;

 namespace Renta.Toolkit.Logging
{
    [LayoutRenderer(Name)]
    public sealed class UserAgentLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.UserAgent;
        }

        /// <summary>
        /// "useragent"
        /// </summary>
        public const string Name = "useragent";
    }
}