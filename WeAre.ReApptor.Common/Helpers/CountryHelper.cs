using System;
using System.Globalization;
using System.Linq;
using WeAre.ReApptor.Common.Models;
using WeAre.ReApptor.Toolkit;

namespace WeAre.ReApptor.Common.Helpers
{
    public static class CountryHelper
    {
        public static readonly CountryInfo[] Countries =
        {
            //Cultures:
            //http://www.codedigest.com/CodeDigest/207-Get-All-Language-Country-Code-List-for-all-Culture-in-C---ASP-Net.aspx
            //Culture: [language-COUNTRYCODE]
            
            //Timezones:
            //http://www.world-timedate.com/timezone/timezone_info_by_country.php?country_id=46
            
            //TODO: Generate from all culture
            new CountryInfo("fi", "Suomi", "Finland", "fi-fi", new[] { "Europe/Helsinki", "FLE Standard Time" }, "FLE Standard Time"),
            new CountryInfo("se", "Svenska", "Sweden", "sv-se", new[] { "Europe/Stockholm", "W. Europe Standard Time" }, "sv"),
            new CountryInfo("no", "Norge", "Norway", "nb-no", new[] { "Europe/Oslo", "W. Europe Standard Time" }, "nb", "nor"),
            new CountryInfo("dk", "Danmark", "Denmark", "da-dk", new[] { "Europe/Copenhagen", "Romance Standard Time" }, "da"),
            new CountryInfo("pl", "Polska", "Poland", "pl-pl", new[] { "Europe/Warsaw", "Central European Standard Time" }),
            new CountryInfo("ru", "Россия", "Russia", "ru-ru", new[] { "Europe/Moscow", "Russian Standard Time", "Moscow Standard Time" }),
            new CountryInfo("ua", "Україна", "Ukraine", "uk-ua", new[] { "Europe/Kiev", "Eastern European Time" }, "uk"),
            new CountryInfo("gb", "United Kingdom", "United Kingdom", "en-GB", new[] { "Europe/London", "GMT Standard Time" }, "en"),
            new CountryInfo("us", "United States", "United States", "en-US", new[] { "America/Los_Angeles", "Pacific Standard Time" }),
        };

        public static readonly CountryInfo DefaultCountry = Countries[0];

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

        public static string GetCountryName(this string country)
        {
            CountryInfo countryInfo = country.FindCountryInfo();

            return countryInfo?.Name ?? country;
        }

        public static string GetCountryName(this CultureInfo culture)
        {
            return GetCountryName(culture?.TwoLetterISOLanguageName);
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