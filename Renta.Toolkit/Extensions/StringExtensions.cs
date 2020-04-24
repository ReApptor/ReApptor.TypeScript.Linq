using System;
using System.Collections.Generic;
using System.Text;

namespace Renta.Toolkit.Extensions
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

        #region Url File format

        public static byte[] ExtractRawDataFromUrl(this string src)
        {
            return Utility.ExtractRawDataFromUrl(src);
        }

        #endregion
    }
}