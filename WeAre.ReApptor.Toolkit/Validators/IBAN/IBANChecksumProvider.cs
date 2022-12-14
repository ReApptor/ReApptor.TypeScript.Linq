using System;
using System.Globalization;
using System.Text;

namespace WeAre.ReApptor.Toolkit.Validators.IBAN
{
    internal static class IBANChecksumProvider
    {
        public static int GenerateChecksum(string data, out string checkDigits)
        {
            if (string.IsNullOrEmpty(data))
                throw new ArgumentNullException(nameof(data));

            const int asciiShift = 55;
            var sb = new StringBuilder();
            foreach (char c in data)
            {
                int v;
                if (char.IsLetter(c))
                {
                    v = c - asciiShift;
                }
                else
                {
                    v = int.Parse(c.ToString(CultureInfo.InvariantCulture));
                }
                sb.Append(v);
            }
            string checkSumString = sb.ToString();
            int checksum = int.Parse(checkSumString.Substring(0, 1));
            for (int i = 1; i < checkSumString.Length; i++)
            {
                int v = int.Parse(checkSumString.Substring(i, 1));
                checksum *= 10;
                checksum += v;
                checksum %= 97;
            }
            checkDigits = $"{98 - checksum:00}";
            return checksum;
        }

        public static string GenerateChecksum(string data)
        {
            if (string.IsNullOrEmpty(data))
                throw new ArgumentNullException(nameof(data));

            GenerateChecksum(data, out string checkDigits);
            
            return checkDigits;
        }

        public static bool IsCorrectChecksum(string data)
        {
            if (string.IsNullOrEmpty(data))
                throw new ArgumentNullException(nameof(data));

            int checksum = GenerateChecksum(data, out _);
            
            return (checksum == 1);
        }
    }
}