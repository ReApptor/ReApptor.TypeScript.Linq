using PhoneNumbers;

namespace WeAre.Apps.Common.Helpers
{
    public static class PhoneHelper
    {
        public static string ToInternationalNumber(this string value, string country, bool personalOnly = true)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            PhoneNumberUtil provider = PhoneNumberUtil.GetInstance();
                
            try
            {
                PhoneNumber number = (!string.IsNullOrWhiteSpace(country))
                    ? provider.Parse(value, country.ToUpperInvariant())
                    : provider.Parse(value, "ZZ");

                if (personalOnly)
                {
                    PhoneNumberType type = provider.GetNumberType(number);
                    if ((type != PhoneNumberType.MOBILE) && (type != PhoneNumberType.PERSONAL_NUMBER) && (type != PhoneNumberType.FIXED_LINE_OR_MOBILE))
                    {
                        return null;
                    }
                }
                
                return provider.Format(number, PhoneNumberFormat.E164);
            }
            catch(NumberParseException)
            {
                return null;
            }
        }

        public static bool IsPhoneNumberValid(this string phone, string defaultCountry = null, bool personalOnly = true)
        {
            string internationalNumber = phone.ToInternationalNumber(defaultCountry, personalOnly);
            
            return (internationalNumber != null) && (!string.IsNullOrWhiteSpace(internationalNumber));
        }
    }
}