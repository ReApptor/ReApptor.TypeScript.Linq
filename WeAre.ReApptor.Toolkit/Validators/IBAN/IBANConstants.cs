using System.Collections.Generic;

namespace WeAre.ReApptor.Toolkit.Validators.IBAN
{
    public class IBANConstants
    {
        private static readonly object Lock = new object();
        private static SortedList<IBANCountry, string> _countryCodes;
        private static SortedList<string, IBANCountry> _euCountryList;
        private static SortedList<IBANCountry, int> _countryBBANLength;

        /// <summary>
        /// "15"
        /// </summary>
        public const int MinIBANLength = 15;

        /// <summary>
        /// BBAN (IBAN) length for different countries (IBAN length = BBAN length + 4)
        /// </summary>
        public static SortedList<IBANCountry, int> CountryBBANLength
        {
            get
            {
                lock (Lock)
                {
                    if (_countryBBANLength == null)
                    {
                        _countryBBANLength = new SortedList<IBANCountry, int>();
                        IBANAttribute[] attributes = IBANAttribute.GetAttributes<IBANCountry>();
                        foreach (IBANAttribute attribute in attributes)
                        {
                            _countryBBANLength.Add((IBANCountry)attribute.Value, attribute.BBANLength);
                        }
                    }

                    return _countryBBANLength;
                }
            }
        }

        /// <summary>
        /// Country codes for BIC and IBAN
        /// </summary>
        public static SortedList<IBANCountry, string> CountryCodes
        {
            get
            {
                lock (Lock)
                {
                    if (_countryCodes == null)
                    {
                        _countryCodes = new SortedList<IBANCountry, string>();
                        IBANAttribute[] attributes = IBANAttribute.GetAttributes<IBANCountry>();
                        foreach (IBANAttribute attribute in attributes)
                        {
                            _countryCodes.Add((IBANCountry)attribute.Value, attribute.CountryCode);
                        }
                    }

                    return _countryCodes;
                }
            }
        }

        public static SortedList<string, IBANCountry> EuCountries
        {
            get
            {
                lock (Lock)
                {
                    if (_euCountryList == null)
                    {
                        _euCountryList = new SortedList<string, IBANCountry>();
                        IBANAttribute[] attributes = IBANAttribute.GetAttributes<IBANCountry>();
                        foreach (IBANAttribute attribute in attributes)
                        {
                            _euCountryList.Add(attribute.CountryCode, (IBANCountry)attribute.Value);
                        }
                    }

                    return _euCountryList;
                }
            }
        }
    }
}