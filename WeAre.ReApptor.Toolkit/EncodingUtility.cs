using System;
using System.Text;

namespace WeAre.ReApptor.Toolkit
{
    public static class EncodingUtility
    {
        public static string ConvertEncoding(string value, Encoding source, Encoding destination)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));
            if (destination == null)
                throw new ArgumentNullException(nameof(destination));

            if ((string.IsNullOrWhiteSpace(value)) || (destination.EncodingName == source.EncodingName))
            {
                return value;
            }

            byte[] rawData = source.GetBytes(value);
            rawData = Encoding.Convert(source, destination, rawData);
            value = destination.GetString(rawData);
            return value;
        }

        public static string ConvertEncoding(string value, Encoding destination)
        {
            return ConvertEncoding(value, Encoding.UTF8, destination);
        }

        public static byte[] GetBytes(string value, Encoding source, Encoding destination, bool bom = false)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));
            if (destination == null)
                throw new ArgumentNullException(nameof(destination));

            byte[] rawData;
            if (value != null)
            {
                rawData = source.GetBytes(value);
                if (destination.EncodingName != source.EncodingName)
                {
                    rawData = Encoding.Convert(source, destination, rawData);
                }
            }
            else
            {
                rawData = new byte[0];
            }

            if (bom)
            {
                byte[] preamble = destination.GetPreamble();
                if (preamble.Length > 0)
                {
                    if (rawData.Length > 0)
                    {
                        byte[] buffer = new byte[preamble.Length + rawData.Length];
                        Array.Copy(preamble, buffer, preamble.Length);
                        Array.Copy(rawData, 0, buffer, preamble.Length, rawData.Length);
                        rawData = buffer;
                    }
                    else
                    {
                        rawData = preamble;
                    }
                }
            }

            return rawData;
        }

        public static byte[] GetBytes(string value, Encoding destination, bool bom = false)
        {
            return GetBytes(value, Encoding.UTF8, destination, bom);
        }
    }
}