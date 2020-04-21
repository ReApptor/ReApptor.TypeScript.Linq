﻿using NLog.LayoutRenderers;
 using Renta.Toolkit.Logging;
 using Renta.Toolkit.Providers;

 namespace Renta.Toolkit.Logging
{
    [LayoutRenderer(Name)]
    public sealed class BrowserIdLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.BrowserId;
        }

        /// <summary>
        /// "browserid"
        /// </summary>
        public const string Name = "browserid";
    }
}