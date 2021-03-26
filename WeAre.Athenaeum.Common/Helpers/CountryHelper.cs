using System;
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
            new CountryInfo("fi", "Suomi", "Finland", "fi-fi"),
            new CountryInfo("se", "Svenska", "Sweden", "sv", "sv-se"),
            new CountryInfo("no", "Norge", "Norway", "nb", "nor", "nb-no"),
            new CountryInfo("dk", "Danmark", "Denmark", "da", "da-dk"),
            new CountryInfo("pl", "Polska", "Poland", "pl-pl"),
            new CountryInfo("ru", "Россия", "Russia", "ru-ru"),
            new CountryInfo("ua", "Україна", "Ukraine", "uk", "uk-ua")
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
                       Countries.FirstOrDefault(item => item.Aliases.Any(alias => alias.Equals(country, StringComparison.InvariantCultureIgnoreCase)));
            }

            return null;
        }

        public static string GetCountryCode(this string country)
        {
            CountryInfo countryInfo = country.FindCountryInfo();

            return countryInfo?.Code;
        }

        public static string GetCountryName(this string countryCode)
        {
            CountryInfo countryInfo = countryCode.FindCountryInfo();

            return countryInfo?.Name;
        }

        public static bool IsCountry(this string countryCode, string name)
        {
            return ((!string.IsNullOrWhiteSpace(countryCode)) && (!string.IsNullOrWhiteSpace(name))) && (countryCode.GetCountryCode() == name.GetCountryCode());
        }
    }
}