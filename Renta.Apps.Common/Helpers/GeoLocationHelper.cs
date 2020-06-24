using System.Linq;
using System.Text.RegularExpressions;
using Renta.Apps.Common.Interfaces.Geo;
using Renta.Apps.Common.Models.Geo;

namespace Renta.Apps.Common.Helpers
{
    public static class GeoLocationHelper
    {
        private static readonly Regex Regex = new Regex(@"(\d{5})", RegexOptions.Compiled | RegexOptions.CultureInvariant);

        private static void FindTown(string externalAddress1, string externalAddress2, out string town, out string address)
        {
            town = AddressHelper.FindTownFromText(externalAddress1);
            if (!string.IsNullOrWhiteSpace(town))
            {
                address = externalAddress2;
            }
            else
            {
                town = AddressHelper.FindTownFromText(externalAddress2);
                address = externalAddress1;
            }
        }

        private static string FindPostalCode(string externalAddress1, string externalAddress2, out string address)
        {
            Match match = Regex.Match(externalAddress1);
            string postalCode = null;
            address = null;
            if (match.Success)
            {
                postalCode = match.Value;
                address = externalAddress2;
                return postalCode;
            }

            Match match2 = Regex.Match(externalAddress2);
            if (match2.Success)
            {
                postalCode = match2.Value;
                address = externalAddress1;
            }

            return postalCode;
        }

        public static GeoLocation TryParseLocation(string externalAddress1, string externalAddress2)
        {
            if (string.IsNullOrWhiteSpace(externalAddress1) || string.IsNullOrWhiteSpace(externalAddress2))
            {
                return null;
            }

            try
            {
                string postalCode = FindPostalCode(externalAddress1, externalAddress2, out string address);

                string town;
                if (!string.IsNullOrWhiteSpace(postalCode))
                {
                    town = AddressHelper.GetTownFromZipCode(postalCode);
                }
                else
                {
                    FindTown(externalAddress1, externalAddress2, out town, out address);
                }

                if (!string.IsNullOrWhiteSpace(town) &&
                    !string.IsNullOrWhiteSpace(address))
                {
                    return new GeoLocation
                    {
                        Address = address,
                        City = town,
                        Country = "fi",
                        PostalCode = postalCode
                    };
                }

                return null;
            }
            catch
            {
                return null;
            }
        }

        public static string GetFormattedAddress(this IGeoAddress address)
        {
            if (address != null)
            {
                string[] items = {address.Address, address.City, address.PostalCode, address.Country.GetCountryName()};
                
                items = items.Where(item => !string.IsNullOrWhiteSpace(item)).ToArray();
                
                if (items.Length > 0)
                {
                    return string.Join(", ", items);
                }
            }

            return "";
        }

        public static string GetCountryCode(this string country)
        {
            if (!string.IsNullOrWhiteSpace(country))
            {
                country = country.Trim().ToLowerInvariant();

                switch (country)
                {
                    case "fi":
                    case "suomi":
                    case "finland":
                        return "fi";
                    case "se":
                    case "svenska":
                    case "sweden":
                        return "se";
                    case "no":
                    case "norge":
                    case "norway":
                        return "no";
                }
            }

            return country;
        }
        
        public static string GetCountryName(this string countryCode)
        {
            if (!string.IsNullOrWhiteSpace(countryCode))
            {
                countryCode = countryCode.Trim().ToLowerInvariant();

                switch (countryCode)
                {
                    case "fi":
                    case "suomi":
                    case "finland":
                        return "Suomi";
                    case "se":
                    case "sweden":
                    case "svenska":
                        return "Svenska";
                    case "no":
                    case "norway":
                    case "norge":
                        return "Norge";
                }
            }

            return countryCode;
        }
    }
}