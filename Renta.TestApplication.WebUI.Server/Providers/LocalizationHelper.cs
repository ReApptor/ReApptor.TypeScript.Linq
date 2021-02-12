using System;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Providers
{
    public static class LocalizationHelper
    {
        public static CultureInfo FindRequestCulture(this HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            string value = context.Request.Query["lang"].FirstOrDefault() ??
                           context.Request.Query["language"].FirstOrDefault() ??
                           context.Request.Query["culture"].FirstOrDefault();

            return FindCulture(value);
        }

        public static CultureInfo FindCookieCulture(this HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));


            string value = (context.Request.Cookies.ContainsKey(CookieRequestCultureProvider.DefaultCookieName))
                ? context.Request.Cookies[CookieRequestCultureProvider.DefaultCookieName]
                : null;

            if (!string.IsNullOrWhiteSpace(value))
            {
                ProviderCultureResult result = CookieRequestCultureProvider.ParseCookieValue(value);
                value = result.Cultures?.FirstOrDefault().Value ?? result.UICultures?.FirstOrDefault().Value;
            }

            return FindCulture(value);
        }

        public static CultureInfo FindHostCulture(this HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            string[] items = context.Request.Host.Host.Split('.');
            string country = items.Last();
            return FindCulture(country);
        }

        public static CultureInfo RecognizeCulture(this HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            CultureInfo culture = FindRequestCulture(context) ??
                                  FindCookieCulture(context) ??
                                  FindHostCulture(context);
                                  //?? SharedResources.DefaultCulture;

            return culture;
        }

        public static CultureInfo RecognizeCountry(this HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            CultureInfo culture = FindHostCulture(context);// ?? SharedResources.DefaultCulture;

            return culture;
        }

        public static void SaveCookieCulture(this HttpContext context, CultureInfo culture)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            if (culture == null)
                throw new ArgumentNullException(nameof(culture));

            var requestCulture = new RequestCulture(culture);
            context.Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(requestCulture),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );
        }

        public static void SaveCookieCulture(this HttpContext context, string language)
        {
            CultureInfo culture = FindCulture(language);

            if (culture == null)
                throw new ArgumentOutOfRangeException(nameof(language), $"Language \"{language}\" not supported.");

            SaveCookieCulture(context, culture);
        }

        public static CultureInfo FindCulture(string language)
        {
            // CultureInfo culture = (!string.IsNullOrWhiteSpace(language))
            //     ? SharedResources.SupportedCultures.FirstOrDefault(item => item.DisplayName.Equals(language, StringComparison.InvariantCultureIgnoreCase) ||
            //                                                                item.Name.Equals(language, StringComparison.InvariantCultureIgnoreCase) ||
            //                                                                item.TwoLetterISOLanguageName.Equals(language, StringComparison.InvariantCultureIgnoreCase) ||
            //                                                                item.Name.EndsWith($"-{language}", StringComparison.InvariantCultureIgnoreCase))
            //     : null;
            //
            // return culture;
            return null;
        }

        public static bool SupportLanguage(string language)
        {
            return (FindCulture(language) != null);
        }
    }
}
