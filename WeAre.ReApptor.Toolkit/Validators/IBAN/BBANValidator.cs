using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using WeAre.ReApptor.Toolkit.Extensions;

namespace WeAre.ReApptor.Toolkit.Validators.IBAN
{
    public static class BBANValidator
    {
        public const string RegexPattern = @"^\d+$";

        #region Finish Banks Constants

        public static readonly byte[] FinishBBANCheckDigitWeights = new byte[] { 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2 };

        public static readonly Dictionary<string, int> FinishBBANPrefixLength = new Dictionary<string, int>
        {
            { "1", 1 },
            { "2", 1 },
            { "3", 2 },
            { "4", 4 },
            { "5", 1 },
            { "6", 1 },
            { "7", 1 },
            { "71", 3 },
            { "8", 1 },
            { "9", 1 },
            { "47", 2 },
        };

        #endregion

        /// <summary>
        /// Calculates check digit of the Finnish bank account in electronic format.
        /// </summary>
        private static bool FinishChecksum(string bban)
        {
            // The check digit for a Finnish account number is calculated using the weighted coefficients of
            // Luhn Modulus 10 with weights 2, 1, 2, 1, 2, 1 … from right to left. The first 13 digits of an
            // account number in electronic format are included in the calculation. The digits are multiplied by
            // their weights and the digits of the products are added up. The total of the digits reflecting the
            // products is deducted from the next figure multiple of 10. The difference is the check digit to be
            // inserted at the end of the account number as the 14th digit.
            //
            // Example calculation of the check digit for an account number
            // 1 2 3 4 5 6 0 0 0 0 0 7 8 5 account number in computer-readable format
            // 1 2 3 4 5 6 0 0 0 0 0 7 8 digits included in the calculation
            // 2 1 2 1 2 1 2 1 2 1 2 1 2 weights
            // 2 2 6 4 10 6 0 0 0 0 0 7 16 products
            // 2+2+ 6+4+1+0 + 6+0+0+0+0+0+7+1+6 = 35 total of digits reflecting the products
            // 40 - 35 = 5 check digit

            int sum = 0;
            int firstIndex = Math.Min(bban.Length - 2, FinishBBANCheckDigitWeights.Length - 1);
            for (int i = firstIndex; i >= 0; i--)
            {
                byte b = Byte.Parse(bban[i].ToString(CultureInfo.InvariantCulture));
                int localProduct = b * FinishBBANCheckDigitWeights[i];
                sum += localProduct % 10 + ((localProduct - localProduct % 10) / 10);
            }

            int numResult = (10 - (sum % 10)) % 10;
            char result = Char.Parse(numResult.ToString(CultureInfo.InvariantCulture));
            return (result == bban.Last());
        }

        public static bool IsValid(string bban, IBANCountry? country, out string error, bool removeSpacesDashes = true)
        {
            error = null;

            if (string.IsNullOrWhiteSpace(bban))
            {
                error = $"Invalid BBAN format \"{bban}\". The BBAN code is not defined. Null or empty string.";
                return false;
            }

            if (removeSpacesDashes)
            {
                bban = bban.RemoveAllSpacesAndDashes().ToUpper();
            }

            if (!Regex.IsMatch(bban, RegexPattern))
            {
                error = $"Invalid BBAN format \"{bban}\". Only symbols 'A'-'Z' and numbers '0'-'9' are allowed.";
                return false;
            }

            if (country != null)
            {
                int bbanLength = IBANConstants.CountryBBANLength[country.Value];
                if (bban.Length != bbanLength)
                {
                    error = $"Invalid BBAN format \"{bban}\". The length of the BBAN for country \"{country}\" is {bbanLength} symbols.";
                    return false;
                }
            }

            return true;
        }

        public static bool IsValid(string bban, out string error, bool removeSpacesDashes = true)
        {
            return IsValid(bban, null, out error, removeSpacesDashes);
        }

        public static bool IsValid(string bban, IBANCountry? country = null)
        {
            return IsValid(bban, country, out _);
        }

        /// <summary>
        /// Validates the specified bank account in BBAN format
        /// </summary>
        public static void Validate(string bban, IBANCountry? country = null)
        {
            if (!IsValid(bban, country, out string error))
                throw new FormatException(error);
        }

        public static string GetBBANPrefix(string finlandBBAN)
        {
            if (!IsValid(finlandBBAN, IBANCountry.Finland, out string error))
                throw new FormatException(error);

            string prefix = finlandBBAN.Substring(0, 2);

            if (!FinishBBANPrefixLength.ContainsKey(prefix))
            {
                prefix = finlandBBAN.Substring(0, 1);
            }

            if (!FinishBBANPrefixLength.ContainsKey(prefix))
                throw new FormatException($"Invalid BBAN format \"{finlandBBAN}\". Unknown BBAN prefix.");

            return finlandBBAN.Substring(0, FinishBBANPrefixLength[prefix]);
        }

        public static string ToIBAN(string bban, IBANCountry country)
        {
            if (!IsValid(bban, country, out string error))
                throw new FormatException(error);

            string data = $"{bban}{IBANConstants.CountryCodes[country]}00";
            string checkDigits = IBANChecksumProvider.GenerateChecksum(data);
            return $"{IBANConstants.CountryCodes[country]}{checkDigits}{bban}";
        }

        public static bool IsFinnish(string finlandBBAN)
        {
            return IsValid(finlandBBAN, IBANCountry.Finland);
        }

        public static string ToMachineFormat(string bban)
        {
            Validate(bban);
            bban = bban.RemoveAllSpacesAndDashes();
            bban = bban.ToUpperInvariant();
            return bban;
        }

        public static string ToHumanFormat(string bban)
        {
            Validate(bban);
            bban = ToMachineFormat(bban);

            const int startCount = 6;
            bool isSpecial = (bban[0] == '4') || (bban[0] == '5');
            int i;

            if (!isSpecial)
            {
                i = startCount;
            }
            else
            {
                i = startCount + 1;
            }

            while (bban[i] == '0' && (i < bban.Length))
            {
                i++;
            }

            return (!isSpecial)
                ? $"{bban.Substring(0, startCount)}-{bban.Substring(i, bban.Length - i)}"
                : $"{bban.Substring(0, startCount)}-{bban.Substring(startCount, 1)}{bban.Substring(i, bban.Length - i)}";
        }

        public static bool Equals(string bbanX, string bbanY)
        {
            Validate(bbanX);
            Validate(bbanY);
            return (string.Compare(ToMachineFormat(bbanX), ToMachineFormat(bbanY), StringComparison.InvariantCultureIgnoreCase) == 0);
        }
    }
}