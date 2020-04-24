using System;
using System.Globalization;

namespace Renta.Toolkit.Extensions
{
    public static class CultureInfoExtensions
    {
        public static string GetLanguage(this CultureInfo culture)
        {
            if (culture == null)
                throw new ArgumentNullException(nameof(culture));

            return culture.TwoLetterISOLanguageName;
        }

        public static string GetNativeLanguage(this CultureInfo culture, bool useTitleCase = true)
        {
            if (culture == null)
                throw new ArgumentNullException(nameof(culture));

            string nativeName = culture.IsNeutralCulture
                ? culture.NativeName
                : culture.Parent.NativeName;

            return useTitleCase
                ? CultureInfo.CurrentCulture.TextInfo.ToTitleCase(nativeName)
                : nativeName;
        }
    }
}