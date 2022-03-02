﻿namespace WeAre.ReApptor.Toolkit.Extensions
{
    public static class ByteArrayExtensions
    {
        /// <summary>
        /// Hash SHA1
        /// </summary>
        public static byte[] Hash1(this byte[] data)
        {
            return Utility.Hash1(data);
        }

        /// <summary>
        /// Hash SHA256
        /// </summary>
        public static byte[] Hash256(this byte[] data)
        {
            return Utility.Hash256(data);
        }

        /// <summary>
        /// Hash SHA512
        /// </summary>
        public static byte[] Hash512(this byte[] data)
        {
            return Utility.Hash512(data);
        }

        public static string ToHexString(this byte[] data)
        {
            return Utility.ToHexString(data);
        }

        public static string GetChecksum(this byte[] value)
        {
            return Utility.GetChecksum(value);
        }

        public static byte[] Copy(this byte[] from)
        {
            return Utility.Copy(from);
        }

        public static bool IsEqual(this byte[] x, byte[] y)
        {
            return Utility.IsEqual(x, y);
        }

        public static bool StartsWith(this byte[] x, byte[] y)
        {
            return Utility.StartsWith(x, y);
        }

        /// <summary>
        /// Removes UTF file preamble (BOM)
        /// </summary>
        public static byte[] RemoveBomPreamble(this byte[] x)
        {
            return Utility.RemoveBomPreamble(x);
        }

        public static string ToHtmlImage(this byte[] data)
        {
            return Utility.ToHtmlImage(data);
        }

        public static string ToHtmlCsv(this byte[] data)
        {
            return Utility.ToHtmlCsv(data);
        }

        public static string ToHtmlSrc(this byte[] data, string mimeType)
        {
            return Utility.ToHtmlSrc(data, mimeType);
        }
    }
}