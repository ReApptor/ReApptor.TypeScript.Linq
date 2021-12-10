using System;
using System.Globalization;
using System.Linq;
using WeAre.Athenaeum.Common.Models;

namespace WeAre.Athenaeum.Common.Helpers
{
    public static class CountryHelper
    {
        public static readonly CountryInfo[] Countries =
        {
            //http://www.codedigest.com/CodeDigest/207-Get-All-Language-Country-Code-List-for-all-Culture-in-C---ASP-Net.aspx
            //Culture: [language-COUNTRYCODE]
            
            //TODO: Generate from all culture
            new CountryInfo("fi", "Suomi", "Finland", "fi-fi"),
            new CountryInfo("se", "Svenska", "Sweden", "sv-se", "sv"),
            new CountryInfo("no", "Norge", "Norway", "nb-no", "nb", "nor"),
            new CountryInfo("dk", "Danmark", "Denmark", "da-dk", "da"),
            new CountryInfo("pl", "Polska", "Poland", "pl-pl"),
            new CountryInfo("ru", "Россия", "Russia", "ru-ru"),
            new CountryInfo("gb", "United Kingdom", "United Kingdom", "en-GB", "en"),
            new CountryInfo("us", "United States", "United States", "en-US"),
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