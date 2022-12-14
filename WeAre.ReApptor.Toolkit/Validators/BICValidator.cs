using System;
using System.Text.RegularExpressions;
using WeAre.ReApptor.Toolkit.Extensions;
using WeAre.ReApptor.Toolkit.Validators.IBAN;

namespace WeAre.ReApptor.Toolkit.Validators
{
    public static class BICValidator
    {
        public const string RegexPattern = "[A-Z0-9]";
        public const int ShortBicLength = 8;
        public const int LongBicLength = 11;

        private static bool IsValid(string bic, out string error)
        {
            error = null;

            if (string.IsNullOrEmpty(bic))
            {
                error = $"Invalid BIC format \"{bic}\". The BIC code is not defined. Null or empty string.";
                return false;
            }

            bic = bic.RemoveAllSpacesAndDashes().ToUpperInvariant();

            if (!Regex.IsMatch(bic, RegexPattern))
            {
                error = $"Invalid BIC format \"{bic}\". Only symbols 'A'-'Z' and numbers '0'-'9' are allowed.";
                return false;
            }

            if ((bic.Length != ShortBicLength) && (bic.Length != LongBicLength))
            {
                error = $"Invalid BIC format \"{bic}\". The length of the BIC identifier can be {ShortBicLength} or {LongBicLength} symbols.";
                return false;
            }

            string countryCode = bic.Substring(4, 2);

            if (IBANConstants.BicCountries.Contains(countryCode))
            {
                return true;
            }

            error = $"Invalid BIC format \"{bic}\". Unknown country code \"{countryCode}\".";
            return false;
        }

        private static bool IsValid(string bic, out IBANCountry country, out string error)
        {
            country = IBANCountry.Finland;
            error = null;

            if (string.IsNullOrEmpty(bic))
            {
                error = $"Invalid BIC format \"{bic}\". The BIC code is not defined. Null or empty string.";
                return false;
            }

            bic = bic.RemoveAllSpacesAndDashes().ToUpper();

            if (!Regex.IsMatch(bic, RegexPattern))
            {
                error = $"Invalid BIC format \"{bic}\". Only symbols 'A'-'Z' and numbers '0'-'9' are allowed.";
                return false;
            }

            if ((bic.Length != ShortBicLength) && (bic.Length != LongBicLength))
            {
                error = $"Invalid BIC format \"{bic}\". The length of the BIC identifier can be {ShortBicLength} or {LongBicLength} symbols.";
                return false;
            }

            string countryCode = bic.Substring(4, 2);

            if (IBANConstants.EuCountries.ContainsKey(countryCode))
            {
                country = IBANConstants.EuCountries[countryCode];
                return true;
            }

            error = $"Invalid BIC format \"{bic}\". Unknown country code \"{countryCode}\".";
            return false;
        }

        public static bool IsValid(string bic)
        {
            return IsValid(bic, out _);
        }

        /// <summary>
        /// Validates the specified bank identifier
        /// </summary>
        /// <param name="bic">Bank identifier in BIC format (Business Identifier Code - SWIFT code)</param>
        /// <exception cref="System.FormatException"></exception>
        public static void Validate(string bic)
        {
            if (!IsValid(bic, out string error))
                throw new FormatException(error);
        }

        public static IBANCountry GetCountry(string bic)
        {
            if (!IsValid(bic, out var country, out var error))
                throw new ArgumentOutOfRangeException(nameof(bic), error);

            return country;
        }

        public static string GetCountryCode(string bic)
        {
            IBANCountry country = GetCountry(bic);
            return IBANConstants.CountryCodes[country];
        }

        public static string ToMachineFormat(string bic)
        {
            Validate(bic);
            bic = bic.RemoveAllSpacesAndDashes();
            bic = bic.ToUpperInvariant();
            return bic;
        }

        public static string ToHumanFormat(string bic)
        {
            Validate(bic);
            bic = ToMachineFormat(bic);
            return bic;
        }

        public static bool Equals(string bicX, string bicY)
        {
            Validate(bicX);
            Validate(bicY);
            return (string.Compare(ToMachineFormat(bicX), ToMachineFormat(bicY), StringComparison.InvariantCultureIgnoreCase) == 0);
        }
    }
}