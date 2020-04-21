﻿using NLog.LayoutRenderers;
 using Renta.Toolkit.Logging;
 using Renta.Toolkit.Providers;

 namespace Renta.Toolkit.Logging
{
    [LayoutRenderer(Name)]
    public sealed class LanguageLayoutRenderer : BaseLayoutRenderer
    {
        protected override string GetValue(HttpContextProvider provider)
        {
            return provider.Language;
        }

        /// <summary>
        /// "language"
        /// </summary>
        public const string Name = "language";
    }
}