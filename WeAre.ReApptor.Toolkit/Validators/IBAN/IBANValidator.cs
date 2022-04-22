using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using WeAre.ReApptor.Toolkit.Extensions;
using WeAre.ReApptor.Toolkit.Validators.IBAN;

namespace WeAre.ReApptor.Common.Validators.IBAN
{
    public static class IBANValidator
    {
        private const long Max = 999999999;
        private const int Mod = 97;
        private const int CountryCodeIndex = 0;
        private const int CountryCodeLength = 2;
        private const int CheckDigitIndex = CountryCodeLength;
        private const int CheckDigitLength = 2;
        private const int BBANIndex = CheckDigitIndex + CheckDigitLength;
        public const string RegexPattern = "[A-Z0-9]";

        private static bool IsCorrectChecksum(string iban)
        {
            string data = iban.Substring(4) + iban.Substring(0, 4);
            return IBANChecksumProvider.IsCorrectChecksum(data);
        }

        public static bool IsValid(string iban, out IBANCountry country, out string error, bool removeSpacesDashes = true)
        {
            country = IBANCountry.Finland;

            if (string.IsNullOrWhiteSpace(iban))
            {
                error = $"Invalid IBAN format \"{iban}\". The IBAN code is not defined. Null or empty string.";
                return false;
            }

            if (removeSpacesDashes)
            {
                iban = iban.RemoveAllSpacesAndDashes();
            }

            if (!Regex.IsMatch(iban, RegexPattern))
            {
                error = $"Invalid IBAN format \"{iban}\". Only symbols 'A'-'Z' and numbers '0'-'9' are allowed.";
                return false;
            }

            int minLength = IBANConstants.CountryBBANLength.Values.Min();
            if (iban.Length < minLength)
            {
                error = $"Invalid IBAN format \"{iban}\". The min length of the IBAN is {minLength} symbols.";
                return false;
            }

            bool unknownCountry = true;
            string countryCode = iban.Substring(0, 2);

            if (IBANConstants.EuCountries.ContainsKey(countryCode))
            {
                country = IBANConstants.EuCountries[countryCode];
                unknownCountry = false;
            }

            if (unknownCountry)
            {
                error = $"Invalid IBAN format \"{iban}\". Unknown country code \"{countryCode}\".";
                return false;
            }

            int length = IBANConstants.CountryBBANLength[country] + 4;
            if (iban.Length != length)
            {
                error = $"Invalid IBAN format \"{iban}\". The length of the IBAN identifier for \"{country}\" is {length} symbols.";
                return false;
            }

            if (!IsCorrectChecksum(iban))
            {
                error = $"Invalid IBAN format \"{iban}\". Invalid checksum {iban.Substring(2, 2)}.";
                return false;
            }

            string bban = iban.Substring(4);

            if (!BBANValidator.IsValid(bban, country, out error))
            {
                error = $"Invalid IBAN format \"{iban}\" for country \"{country}\". {error}";
                return false;
            }

            if (!IsValidCheckDigitValue(iban))
            {
                error = $"Invalid IBAN format \"{bban}\". Invalid checksum {bban.Last()}.";
                return false;
            }

            error = null;
            return true;
        }

        private static bool IsValidCheckDigitValue(string iban)
        {
            string reformattedIban = iban.Substring(BBANIndex) + iban.Substring(CountryCodeIndex, CountryCodeLength + CheckDigitLength);
            double total = 0;

            char[] letters = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };

            for (int i = 0; i < reformattedIban.Length; i++)
            {
                double numericValue = char.IsLetter(reformattedIban[i]) ? (10 + Array.IndexOf(letters, reformattedIban[i])) : char.GetNumericValue(reformattedIban[i]);
                if (numericValue < 0 || numericValue > 35)
                {
                    return false;
                }

                total = (numericValue > 9 ? total * 100 : total * 10) + numericValue;

                if (total > Max)
                {
                    total = (total % Mod);
                }
            }

            return (int)(total % Mod) == 1;
        }

        public static bool IsValid(string iban, out string error)
        {
            return IsValid(iban, out _, out error);
        }

        public static bool IsValid(string iban)
        {
            return IsValid(iban, out _, out _);
        }

        /// <summary>
        /// Validates the specified bank account in IBAN format
        /// </summary>
        /// <param name="iban">Bank account in IBAN format (International Bank Account Number)</param>
        public static void Validate(string iban)
        {
            if (!IsValid(iban, out _, out string error))
                throw new FormatException(error);
        }

        public static IBANCountry GetCountry(string iban)
        {
            if (!IsValid(iban, out IBANCountry country, out string error))
                throw new FormatException(error);

            return country;
        }

        public static string GetCountryCode(string iban)
        {
            IBANCountry country = GetCountry(iban);
            return IBANConstants.CountryCodes[country];
        }

        public static string GetBICByBBANPrefix(string bban)
        {
            // ReSharper disable once InconsistentNaming
            var finishBICtoBBAN = new List<Tuple<string, string>>
            {
                new Tuple<string, string>("1", "NDEAFIHH"),
                new Tuple<string, string>("2", "NDEAFIHH"),
                new Tuple<string, string>("5", "OKOYFIHH"),
                new Tuple<string, string>("6", "AABAFI22"),

                new Tuple<string, string>("8", "DABAFIHH"),
                new Tuple<string, string>("31", "HANDFIHH"),
                new Tuple<string, string>("33", "ESSESESS"),
                new Tuple<string, string>("34", "DABAFIHX"),

                new Tuple<string, string>("36", "TAPIFI22"),
                new Tuple<string, string>("37", "DNBAFIHX"),
                new Tuple<string, string>("38", "DNBAFIHX"),
                new Tuple<string, string>("39", "SBANFIHH"),

                new Tuple<string, string>("47", "POPFFI22"),
                new Tuple<string, string>("400", "ITELFIHH"),
                new Tuple<string, string>("402", "ITELFIHH"),
                new Tuple<string, string>("403", "ITELFIHH"),

                new Tuple<string, string>("406", "ITELFIHH"),
                new Tuple<string, string>("407", "ITELFIHH"),
                new Tuple<string, string>("408", "ITELFIHH"),
                new Tuple<string, string>("410", "ITELFIHH"),

                new Tuple<string, string>("411", "ITELFIHH"),
                new Tuple<string, string>("412", "ITELFIHH"),
                new Tuple<string, string>("414", "ITELFIHH"),
                new Tuple<string, string>("415", "ITELFIHH"),

                new Tuple<string, string>("416", "ITELFIHH"),
                new Tuple<string, string>("417", "ITELFIHH"),
                new Tuple<string, string>("418", "ITELFIHH"),
                new Tuple<string, string>("419", "ITELFIHH"),

                new Tuple<string, string>("420", "ITELFIHH"),
                new Tuple<string, string>("421", "ITELFIHH"),
                new Tuple<string, string>("423", "ITELFIHH"),
                new Tuple<string, string>("424", "ITELFIHH"),

                new Tuple<string, string>("425", "ITELFIHH"),
                new Tuple<string, string>("426", "ITELFIHH"),
                new Tuple<string, string>("427", "ITELFIHH"),
                new Tuple<string, string>("428", "ITELFIHH"),

                new Tuple<string, string>("429", "ITELFIHH"),
                new Tuple<string, string>("430", "ITELFIHH"),
                new Tuple<string, string>("431", "ITELFIHH"),
                new Tuple<string, string>("432", "ITELFIHH"),

                new Tuple<string, string>("435", "ITELFIHH"),
                new Tuple<string, string>("436", "ITELFIHH"),
                new Tuple<string, string>("437", "ITELFIHH"),
                new Tuple<string, string>("438", "ITELFIHH"),

                new Tuple<string, string>("439", "ITELFIHH"),
                new Tuple<string, string>("440", "ITELFIHH"),
                new Tuple<string, string>("441", "ITELFIHH"),
                new Tuple<string, string>("442", "ITELFIHH"),

                new Tuple<string, string>("443", "ITELFIHH"),
                new Tuple<string, string>("444", "ITELFIHH"),
                new Tuple<string, string>("445", "ITELFIHH"),
                new Tuple<string, string>("446", "ITELFIHH"),

                new Tuple<string, string>("447", "ITELFIHH"),
                new Tuple<string, string>("448", "ITELFIHH"),
                new Tuple<string, string>("449", "ITELFIHH"),
                new Tuple<string, string>("450", "ITELFIHH"),

                new Tuple<string, string>("451", "ITELFIHH"),
                new Tuple<string, string>("452", "ITELFIHH"),
                new Tuple<string, string>("454", "ITELFIHH"),
                new Tuple<string, string>("455", "ITELFIHH"),

                new Tuple<string, string>("456", "ITELFIHH"),
                new Tuple<string, string>("457", "ITELFIHH"),
                new Tuple<string, string>("458", "ITELFIHH"),
                new Tuple<string, string>("459", "ITELFIHH"),

                new Tuple<string, string>("460", "ITELFIHH"),
                new Tuple<string, string>("461", "ITELFIHH"),
                new Tuple<string, string>("462", "ITELFIHH"),
                new Tuple<string, string>("463", "ITELFIHH"),

                new Tuple<string, string>("464", "ITELFIHH"),
                new Tuple<string, string>("483", "ITELFIHH"),
                new Tuple<string, string>("484", "ITELFIHH"),
                new Tuple<string, string>("485", "ITELFIHH"),

                new Tuple<string, string>("486", "ITELFIHH"),
                new Tuple<string, string>("487", "ITELFIHH"),
                new Tuple<string, string>("488", "ITELFIHH"),
                new Tuple<string, string>("489", "ITELFIHH"),

                new Tuple<string, string>("490", "ITELFIHH"),
                new Tuple<string, string>("491", "ITELFIHH"),
                new Tuple<string, string>("492", "ITELFIHH"),
                new Tuple<string, string>("493", "ITELFIHH"),

                new Tuple<string, string>("495", "ITELFIHH"),
                new Tuple<string, string>("496", "ITELFIHH"),

                new Tuple<string, string>("711", "BSUIFIHH"),
                new Tuple<string, string>("713", "CITIFIHX"),
                new Tuple<string, string>("715", "ITELFIHH"),
                new Tuple<string, string>("799", "HOLVFIHH"),

                new Tuple<string, string>("4050", "HELSFIHH"),
                new Tuple<string, string>("4055", "HELSFIHH"),
                new Tuple<string, string>("4970", "HELSFIHH")
            };

            for (var i = 0; i < finishBICtoBBAN.Count; i++)
            {
                var prefixCode = finishBICtoBBAN[i].Item1;
                var bbanCode = finishBICtoBBAN[i].Item2;

                if (bban == prefixCode)
                {
                    return bbanCode;
                }
            }

            return "";
        }

        public static string ToBBAN(string iban)
        {
            if (!IsValid(iban, out _, out string error))
                throw new FormatException(error);

            return iban.Substring(4);
        }

        public static string GetBBANPrefix(string iban)
        {
            if (!IsValid(iban, out _, out var error))
                throw new FormatException(error);

            string bban = iban.Substring(4);
            return BBANValidator.GetBBANPrefix(bban);
        }

        public static string ToMachineFormat(string iban)
        {
            Validate(iban);
            iban = iban.RemoveAllSpacesAndDashes();
            iban = iban.ToUpperInvariant();
            return iban;
        }

        public static string ToHumanFormat(string iban)
        {
            Validate(iban);
            iban = ToMachineFormat(iban);

            var sb = new StringBuilder();
            for (int i = 0; i < iban.Length; i++)
            {
                if ((i % 4 == 0) && (i < iban.Length - 1))
                {
                    sb.Append(" ");
                }
                sb.Append(iban[i]);
            }
            return sb.ToString();
        }

        public static bool Equals(string ibanX, string ibanY)
        {
            Validate(ibanX);
            Validate(ibanY);
            return (string.Compare(ToMachineFormat(ibanX), ToMachineFormat(ibanY), StringComparison.InvariantCultureIgnoreCase) == 0);
        }
    }
}