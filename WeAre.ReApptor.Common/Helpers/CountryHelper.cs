using System;
using System.Globalization;
using System.Linq;
using WeAre.ReApptor.Common.Models;
using WeAre.ReApptor.Toolkit;

namespace WeAre.ReApptor.Common.Helpers
{
    public static class CountryHelper
    {
        /// <summary>
        /// "XZ" (Internation waters county code: ISO 3166-1 alpha-2.)
        /// </summary>
        public const string InternationalWatersCode = "XZ";
        
        public static readonly CountryInfo[] Countries =
        {
            //Cultures:
            //http://www.codedigest.com/CodeDigest/207-Get-All-Language-Country-Code-List-for-all-Culture-in-C---ASP-Net.aspx
            //Culture: [language-COUNTRYCODE]
            
            //Timezones:
            //http://www.world-timedate.com/timezone/timezone_info_by_country.php?country_id=46
            
            //TODO: Generate from all culture
            new CountryInfo("fi", "Suomi", "Finland", "fi-fi", new[] { "Europe/Helsinki", "FLE Standard Time" }),
            new CountryInfo("se", "Svenska", "Sweden", "sv-se", new[] { "Europe/Stockholm", "W. Europe Standard Time" }, "sv"),
            new CountryInfo("no", "Norge", "Norway", "nb-no", new[] { "Europe/Oslo", "W. Europe Standard Time" }, "nb", "nor"),
            new CountryInfo("dk", "Danmark", "Denmark", "da-dk", new[] { "Europe/Copenhagen", "Romance Standard Time" }, "da"),
            new CountryInfo("pl", "Polska", "Poland", "pl-pl", new[] { "Europe/Warsaw", "Central European Standard Time" }),
            new CountryInfo("ru", "Россия", "Russia", "ru-ru", new[] { "Europe/Moscow", "Russian Standard Time", "Moscow Standard Time" }),
            new CountryInfo("ua", "Україна", "Ukraine", "uk-ua", new[] { "Europe/Kiev", "Eastern European Time" }, "uk"),
            new CountryInfo("de", "Deutschland", "Germany", "de-de", new[] { "Europe/Berlin", "Central European Time" }),
            new CountryInfo("fr", "France", "France", "fr-fr", new[] { "Europe/Paris", "Central European Time" }),
            new CountryInfo("gb", "United Kingdom", "United Kingdom", "en-gb", new[] { "Europe/London", "GMT Standard Time" }, "en"),
            new CountryInfo("us", "United States", "United States", "en-us", new[] { "America/Los_Angeles", "Pacific Standard Time" }),
        };

        public static readonly CountryInfo DefaultCountry = Countries[0];

        public static bool IsInternationalWaters(this string country)
        {
            return (!string.IsNullOrWhiteSpace(country) && country.Equals(InternationalWatersCode, StringComparison.InvariantCultureIgnoreCase));
        }

        public static CountryInfo FindCountryInfo(this string country)
        {
            if (!string.IsNullOrWhiteSpace(country))
            {
                country = country.Trim();
                
                return Countries.FirstOrDefault(item => item.Code.Equals(country, StringComparison.InvariantCultureIgnoreCase)) ??
                       Countries.FirstOrDefault(item => item.Name.Equals(country, StringComparison.InvariantCultureIgnoreCase)) ??
                       Countries.FirstOrDefault(item => item.EnglishName.Equals(country, StringComparison.InvariantCultureIgnoreCase)) ??
                       Countries.FirstOrDefault(item => item.Culture.Equals(country, StringComparison.InvariantCultureIgnoreCase)) ??
                       Countries.FirstOrDefault(item => item.Aliases.Any(alias => alias.Equals(country, StringComparison.InvariantCultureIgnoreCase)));
            }

            return null;
        }

        public static CountryInfo FindCountryInfo(this CultureInfo culture)
        {
            return culture?.TwoLetterISOLanguageName.FindCountryInfo();
        }

        public static string GetCountryCode(this CultureInfo culture)
        {
            return GetCountryCode(culture?.TwoLetterISOLanguageName);
        }

        public static string GetCountryCode(this string country)
        {
            CountryInfo countryInfo = country.FindCountryInfo();
            
            return countryInfo?.Code ?? country;
        }

        public static string GetCountryName(this string country, bool excludeInternationalWaters = true)
        {
            if ((excludeInternationalWaters) && (country.IsInternationalWaters()))
            {
                return "";
            }

            CountryInfo countryInfo = country.FindCountryInfo();

            return countryInfo?.Name ?? country;
        }

        public static string GetCountryName(this CultureInfo culture, bool excludeInternationalWaters = true)
        {
            return GetCountryName(culture?.TwoLetterISOLanguageName, excludeInternationalWaters);
        }

        public static TimeZoneInfo GetDefaultCountyTimeZone(this string country)
        {
            CountryInfo countryInfo = country.FindCountryInfo();

            return (countryInfo != null)
                ? Utility.GetTimeZone(countryInfo.DefaultTimeZoneIds)
                : null;
        }

        public static TimeZoneInfo GetDefaultCountyTimeZone(this CultureInfo culture)
        {
            CountryInfo countryInfo = culture.FindCountryInfo();

            return (countryInfo != null)
                ? Utility.GetTimeZone(countryInfo.DefaultTimeZoneIds)
                : null;
        }

        public static CultureInfo GetCountryCulture(this string country)
        {
            CountryInfo countryInfo = country.FindCountryInfo();

            return (countryInfo != null)
                ? CultureInfo.GetCultureInfo(countryInfo.Culture)
                : null;
        }

        public static CultureInfo GetCountryCulture(this CultureInfo culture)
        {
            return GetCountryCulture(culture?.TwoLetterISOLanguageName);
        }

        public static bool IsCountry(this string countryCode, string name)
        {
            return ((!string.IsNullOrWhiteSpace(countryCode)) && (!string.IsNullOrWhiteSpace(name))) && (countryCode.GetCountryCode() == name.GetCountryCode());
        }
    }
}