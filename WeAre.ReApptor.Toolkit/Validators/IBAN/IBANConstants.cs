using System.Collections.Generic;

namespace WeAre.ReApptor.Toolkit.Validators.IBAN
{
    public class IBANConstants
    {
        private static readonly object Lock = new object();
        private static HashSet<string> _bicCountries;
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

        public static HashSet<string> BicCountries
        {
            get
            {
                lock (Lock)
                {
                    if (_bicCountries == null)
                    {
                        _bicCountries = new HashSet<string>
                        {
                            "AD",
                            "AE",
                            "AF",
                            "AG",
                            "AI",
                            "AL",
                            "AM",
                            "AO",
                            "AQ",
                            "AR",
                            "AS",
                            "AT",
                            "AU",
                            "AW",
                            "AX",
                            "AZ",
                            "BA",
                            "BB",
                            "BD",
                            "BE",
                            "BF",
                            "BG",
                            "BH",
                            "BI",
                            "BJ",
                            "BL",
                            "BM",
                            "BN",
                            "BO",
                            "BQ",
                            "BR",
                            "BS",
                            "BT",
                            "BV",
                            "BW",
                            "BY",
                            "BZ",
                            "CA",
                            "CC",
                            "CD",
                            "CF",
                            "CG",
                            "CH",
                            "CI",
                            "CK",
                            "CL",
                            "CM",
                            "CN",
                            "CO",
                            "CR",
                            "CU",
                            "CV",
                            "CW",
                            "CX",
                            "CY",
                            "CZ",
                            "DE",
                            "DJ",
                            "DK",
                            "DM",
                            "DO",
                            "DZ",
                            "EC",
                            "EE",
                            "EG",
                            "EH",
                            "ER",
                            "ES",
                            "ET",
                            "FI",
                            "FJ",
                            "FK",
                            "FM",
                            "FO",
                            "FR",
                            "GA",
                            "GB",
                            "GD",
                            "GE",
                            "GF",
                            "GG",
                            "GH",
                            "GI",
                            "GL",
                            "GM",
                            "GN",
                            "GP",
                            "GQ",
                            "GR",
                            "GS",
                            "GT",
                            "GU",
                            "GW",
                            "GY",
                            "HK",
                            "HM",
                            "HN",
                            "HR",
                            "HT",
                            "HU",
                            "ID",
                            "IE",
                            "IL",
                            "IM",
                            "IN",
                            "IO",
                            "IQ",
                            "IR",
                            "IS",
                            "IT",
                            "JE",
                            "JM",
                            "JO",
                            "JP",
                            "KE",
                            "KG",
                            "KH",
                            "KI",
                            "KM",
                            "KN",
                            "KP",
                            "KR",
                            "KW",
                            "KY",
                            "KZ",
                            "LA",
                            "LB",
                            "LC",
                            "LI",
                            "LK",
                            "LR",
                            "LS",
                            "LT",
                            "LU",
                            "LV",
                            "LY",
                            "MA",
                            "MC",
                            "MD",
                            "ME",
                            "MF",
                            "MG",
                            "MH",
                            "MK",
                            "ML",
                            "MM",
                            "MN",
                            "MO",
                            "MP",
                            "MQ",
                            "MR",
                            "MS",
                            "MT",
                            "MU",
                            "MV",
                            "MW",
                            "MX",
                            "MY",
                            "MZ",
                            "NA",
                            "NC",
                            "NE",
                            "NF",
                            "NG",
                            "NI",
                            "NL",
                            "NO",
                            "NP",
                            "NR",
                            "NU",
                            "NZ",
                            "OM",
                            "PA",
                            "PE",
                            "PF",
                            "PG",
                            "PH",
                            "PK",
                            "PL",
                            "PM",
                            "PN",
                            "PR",
                            "PS",
                            "PT",
                            "PW",
                            "PY",
                            "QA",
                            "RE",
                            "RO",
                            "RS",
                            "RU",
                            "RW",
                            "SA",
                            "SB",
                            "SC",
                            "SD",
                            "SE",
                            "SG",
                            "SH",
                            "SI",
                            "SJ",
                            "SK",
                            "SL",
                            "SM",
                            "SN",
                            "SO",
                            "SR",
                            "SS",
                            "ST",
                            "SV",
                            "SX",
                            "SY",
                            "SZ",
                            "TC",
                            "TD",
                            "TF",
                            "TG",
                            "TH",
                            "TJ",
                            "TK",
                            "TL",
                            "TM",
                            "TN",
                            "TO",
                            "TR",
                            "TT",
                            "TV",
                            "TW",
                            "TZ",
                            "UA",
                            "UG",
                            "UM",
                            "US",
                            "UY",
                            "UZ",
                            "VA",
                            "VC",
                            "VE",
                            "VG",
                            "VI",
                            "VN",
                            "VU",
                            "WF",
                            "WS",
                            "XK",
                            "YE",
                            "YT",
                            "ZA",
                            "ZM",
                            "ZW"
                        };
                    }

                    return _bicCountries;
                }
            }
        }
    }
}