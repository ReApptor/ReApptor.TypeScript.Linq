using System;
using WeAre.ReApptor.Toolkit.Attributes;

namespace WeAre.ReApptor.Toolkit.Validators.IBAN
{
    public sealed class IBANAttribute : EnumValueAttribute
    {
        private readonly int _ibanLength;

        public IBANAttribute(string countryCode, int ibanLength)
        {
            if (string.IsNullOrEmpty(countryCode))
                throw new ArgumentNullException(nameof(countryCode));
            if (ibanLength < IBANConstants.MinIBANLength)
                throw new ArgumentOutOfRangeException(nameof(ibanLength), $"Minimum IBAN length is {ibanLength} symbols.");

            CountryCode = countryCode;
            _ibanLength = ibanLength;
        }

        /// <summary>
        /// IBAN country code
        /// </summary>
        public string CountryCode { get; }

        /// <summary>
        /// BBAN length for specified country (IBAN length = BBAN length + 4)
        /// </summary>
        public int BBANLength => _ibanLength - 4;

        /// <summary>
        /// IBAN length for specified country (IBAN length = BBAN length + 4)
        /// </summary>
        public int IBANLength => _ibanLength;

        public static IBANAttribute GetAttribute<TEnumValue>(TEnumValue value)
        {
            return GetAttribute<TEnumValue, IBANAttribute>(value);
        }

        public static IBANAttribute[] GetAttributes<TEnumValue>()
        {
            return GetAttributes<TEnumValue, IBANAttribute>();
        }
    }
}