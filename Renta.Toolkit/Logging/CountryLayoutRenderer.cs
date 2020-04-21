﻿using NLog.LayoutRenderers;
 using Renta.Toolkit.Logging;
 using Renta.Toolkit.Providers;

 namespace Renta.Toolkit.Logging
{
    [LayoutRenderer(Name)]
    public sealed class CountryLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.Country;
        }

        /// <summary>
        /// "country"
        /// </summary>
        public const string Name = "country";
    }
}