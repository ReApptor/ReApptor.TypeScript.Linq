using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace WeAre.ReApptor.Toolkit.Extensions
{
    public static class StringExtensions
    {
        #region Hash

        /// <summary>
        /// Hash SHA1
        /// </summary>
        public static byte[] Hash1(this string data, Encoding encoding = null)
        {
            return Utility.Hash1(data, encoding);
        }

        /// <summary>
        /// Hash SHA256
        /// </summary>
        public static byte[] Hash256(this string data, Encoding encoding = null)
        {
            return Utility.Hash256(data, encoding);
        }

        /// <summary>
        /// Convert any string to Guid (MD5 hash)
        /// </summary>
        public static Guid HashGuid(this string data, Encoding encoding = null)
        {
            return Utility.HashGuid(data, encoding);
        }

        #endregion

        public static string GetChecksum(this string value)
        {
            return Utility.GetChecksum(value);
        }

        public static int GetHashCode(this string value, bool processIndependent)
        {
            return Utility.GetHashCode(value, processIndependent);
        }

        public static bool Like(this string x, string y)
        {
            bool isEmptyX = (string.IsNullOrWhiteSpace(x));
            bool isEmptyY = (string.IsNullOrWhiteSpace(y));
            if ((isEmptyX) && (isEmptyY))
            {
                return true;
            }
            if ((isEmptyX) || (isEmptyY))
            {
                return false;
            }
            return (string.Compare(x, y, StringComparison.InvariantCultureIgnoreCase) == 0);
        }

        public static IEnumerable<string> Chunk(this string value, int size)
        {
            for (int i = 0; i < value.Length; i += size)
            {
                int length = Math.Min(size, value.Length - i);
                string chunk = value.Substring(i, length);
                yield return chunk;
            }
        }

        public static string Encode(this string value)
        {
            return (!string.IsNullOrWhiteSpace(value)) ? HttpUtility.HtmlEncode(value) : null;
        }

        public static string EscapeQuotesFromXml(this string value)
        {
            if (value != null)
            {
                //Change
                //'       &apos; 
                //"       &quot;

                //Regex regexApos = new Regex(@"(?<=>[^<]*)\'(?=[^</]*</)", 
                Regex regexApos = new Regex(@"(?<=<.*>[^<]*)\'(?=.*(</).*>)", RegexOptions.IgnoreCase | RegexOptions.ExplicitCapture | RegexOptions.Singleline);

                //   Regex regexQuot = new Regex(@"(?<=>[^<]*)""(?=[^</]*</)",
                Regex regexQuot = new Regex(@"(?<=<.*>[^<]*)""(?=.*(</).*>)", RegexOptions.IgnoreCase | RegexOptions.ExplicitCapture | RegexOptions.Singleline);

                value = regexApos.Replace(value, "&apos;");
                value = regexQuot.Replace(value, "&quot;");
            }
            
            return value;
        }

        /// <summary>
        /// Removes UTF file preamble (BOM)
        /// </summary>
        public static string RemoveBomPreamble(this string value)
        {
            return Utility.RemoveBomPreamble(value);
        }

        #region Url File format

        public static byte[] ExtractRawDataFromUrl(this string src)
        {
            return Utility.ExtractRawDataFromUrl(src);
        }

        #endregion

        #region Encoding Utility

        public static string ConvertEncoding(this string value, Encoding source, Encoding destination)
        {
            return EncodingUtility.ConvertEncoding(value, source, destination);
        }

        public static string ConvertEncoding(this string value, Encoding destination)
        {
            return EncodingUtility.ConvertEncoding(value, destination);
        }

        public static byte[] GetBytes(this string value, Encoding source, Encoding destination, bool bom = false)
        {
            return EncodingUtility.GetBytes(value, source, destination, bom);
        }

        public static byte[] GetBytes(this string value, Encoding destination, bool bom = false)
        {
            return EncodingUtility.GetBytes(value, destination, bom);
        }

        #endregion
        
        #region Parse

        public static double ToDouble(this string value)
        {
            return Utility.ToDouble(value);
        }

        public static bool TryToDouble(string value, out double result)
        {
            return Utility.TryToDouble(value, out result);
        }

        public static decimal ToDecimal(this string value)
        {
            return Utility.ToDecimal(value);
        }

        public static bool TryToDecimal(string value, out decimal result)
        {
            return Utility.TryToDecimal(value, out result);
        }

        #endregion
    }
}