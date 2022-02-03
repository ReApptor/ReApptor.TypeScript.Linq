using System;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using Renta.Apps.Common.Interfaces.Geo;
using Renta.Apps.Common.Models.Geo;
using WeAre.Athenaeum.Common.Helpers;
using WeAre.Athenaeum.Toolkit;

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

        public static IGeoLocation ReadFormattedAddress(string formattedAddress)
        {
            if (string.IsNullOrWhiteSpace(formattedAddress))
            {
                return null;
            }
            
            IGeoLocation geoLocation = new GeoLocation
            {
                Address = formattedAddress,
                Country = null,
                PostalBox = null,
                City = null,
                PostalCode = null,
            };
                
            //Formatted address comes in formats:
            //  "Äyritie 12, 01510 Vantaa, Finland, #60.21083359999999, 24.951597"
            //  "Äyritie 12, Vantaa, Finland, #60.21083359999999, 24.951597"
            //  "Äyritie 12, Vantaa, 01510, Finland, #60.21083359999999, 24.951597"
            //  "Äyritie 12, Vantaa, Finland, #60.21083359999999, 24.951597"

            bool includesLocation = (formattedAddress.Contains("#", StringComparison.InvariantCultureIgnoreCase));
            if (includesLocation)
            {
                string[] parts = formattedAddress
                    .Replace("#", "")
                    .Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(item => item.Trim())
                    .Where(item => !string.IsNullOrWhiteSpace(item))
                    .ToArray();

                if (parts.Length > 4)
                {
                    string lat = parts[^2];
                    string lon = parts[^1];

                    string[] cityPostalCodeParts = parts[^4].Trim().Split(" ");
                    if (cityPostalCodeParts.Length == 2)
                    {
                        geoLocation.PostalCode = cityPostalCodeParts[0];
                        geoLocation.City = cityPostalCodeParts[1];
                    } else if (cityPostalCodeParts.Length == 1)
                    {
                        if (parts.Length > 5)
                        {
                            geoLocation.PostalCode = parts[^4];
                            geoLocation.City = parts[^5];
                        }
                        else
                        {
                            geoLocation.City = cityPostalCodeParts[0];
                        }
                    }
                        
                    if ((Utility.TryToDecimal(lat, out decimal latitude)) && (latitude > 0))
                    {
                        geoLocation.Lat = latitude;
                    }

                    if ((Utility.TryToDecimal(lon, out decimal longitude)) && (longitude > 0))
                    {
                        geoLocation.Lon = longitude;
                    }
                    
                    geoLocation.Address = parts[0];
                    geoLocation.Country = parts[^3].GetCountryName();
                }
            }

            return geoLocation;
        }

        public static string GetFormattedAddress(this IGeoAddress address, bool includeCoordinates = false)
        {
            if (address != null)
            {
                string[] items = {address.Address, address.City, address.PostalCode, address.Country.GetCountryName()};
                
                items = items.Where(item => !string.IsNullOrWhiteSpace(item)).ToArray();
                
                if (items.Length > 0)
                {
                    string formattedAddress = string.Join(", ", items);
                    
                    if ((includeCoordinates) && (address is IGeoCoordinate coordinates) && (coordinates.Lat > 0) && (coordinates.Lon > 0))
                    {
                        //#LAT, LON"
                        var formatInfo = new NumberFormatInfo { NumberDecimalSeparator = "." };
                        return $"{formattedAddress}, #{coordinates.Lat.ToString(formatInfo)}, {coordinates.Lon.ToString(formatInfo)}";
                    }
                }
            }

            return "";
        }
    }
}