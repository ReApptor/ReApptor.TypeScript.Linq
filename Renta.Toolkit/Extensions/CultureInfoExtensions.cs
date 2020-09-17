using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

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

        public static CultureInfo FindCulture(this IEnumerable<CultureInfo> cultures, string language)
        {
            CultureInfo culture = null;

            if ((!string.IsNullOrWhiteSpace(language)) && (cultures != null))
            {
                culture = cultures.FirstOrDefault(item => item.DisplayName.Equals(language, StringComparison.InvariantCultureIgnoreCase) ||
                                                          item.Name.Equals(language, StringComparison.InvariantCultureIgnoreCase) ||
                                                          item.TwoLetterISOLanguageName.Equals(language, StringComparison.InvariantCultureIgnoreCase) ||
                                                          item.Name.EndsWith($"-{language}", StringComparison.InvariantCultureIgnoreCase));
            }

            return culture;
        }
    }
}