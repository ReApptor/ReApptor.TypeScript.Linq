using WeAre.Apps.Common.Helpers;
using Xunit;

namespace WeAre.ReApptor.Services.UnitTest.Helpers
{
    public sealed class PhoneHelperTests
    {
       [Fact]
        public void ParseInternationalFinNumberTest()
        {
            const string value = @"+358401678671";

            string international = value.ToInternationalNumber("fi");
           
            bool isValid = value.IsPhoneNumberValid("fi");
            
            Assert.Equal("+358401678671", international);
            Assert.True(isValid);
        }
        
        [Fact]
        public void ParseInternationalFinNumberFormattedTest()
        {
            const string value = @"+358 503543937";

            string international = value.ToInternationalNumber("fi");

            bool isValid = value.IsPhoneNumberValid("fi");

            Assert.Equal("+358503543937", international);
            Assert.True(isValid);
        }
        
        [Fact]
        public void ParseInternationalRuNumberTest()
        {
            const string value = @"+79210934237";

            string international = value.ToInternationalNumber("ru");
            
            bool isValid = value.IsPhoneNumberValid("ru");

            Assert.Equal("+79210934237", international);
            Assert.True(isValid);
        }
        
        [Fact]
        public void ParseInternationalRuNumberFormattedTest()
        {
            const string value = @"+7 921 093 42 37";

            string international = value.ToInternationalNumber("ru");
            
            bool isValid = value.IsPhoneNumberValid("ru");

            Assert.Equal("+79210934237", international);
            Assert.True(isValid);
        }
        
        [Fact]
        public void ParseLocalFinNumberTest()
        {
            const string value = @"0401678671";

            string international = value.ToInternationalNumber("fi");

            bool isValid = value.IsPhoneNumberValid("fi");

            Assert.Equal("+358401678671", international);
            Assert.True(isValid);
        }
        
        [Fact]
        public void ParseShortLocalFinNumberTest()
        {
            const string value = @"0100 100";

            string international = value.ToInternationalNumber("fi");
            
            bool isValid = value.IsPhoneNumberValid("fi");
            
            Assert.Null(international);
            Assert.False(isValid);
        }
        
        [Fact]
        public void ParseInternationalSeNumbersTest()
        {
            string[] values = { "0702452886", "+46733498287", "070-2375199", "0709-495541", "072-5884194", "0733-172698", "070-8943734" };

            string[] expectedValues = { "+46702452886", "+46733498287", "+46702375199", "+46709495541", "+46725884194", "+46733172698", "+46708943734" };

            for (int i = 0; i < values.Length; i++)
            {
                string international = values[i].ToInternationalNumber("se");
                
                bool isValid = values[i].IsPhoneNumberValid("se");
                
                Assert.Equal(expectedValues[i], international);
                Assert.True(isValid);
            }
        }
        
        [Fact]
        public void ParseLocalSeNumbersTest()
        {
            string[] values = { "0451 12725", "016-7101000", "0346-737311", "040-141896", "052318911" };
            
            foreach (var value in values)
            {
                string international = value.ToInternationalNumber("se");
                
                bool isValid = value.IsPhoneNumberValid("se");
                
                Assert.Null(international);
                Assert.False(isValid);
            }
        }

        [Fact]
        public void ParseFakeSeNumbersTest()
        {
            string[] values = { "000", "0", "0123 123 1234", "044 123 12345", "0000000000" };

            foreach (var value in values)
            {
                string international = value.ToInternationalNumber("se");
                
                bool isValid = value.IsPhoneNumberValid("se");

                Assert.Null(international);
                Assert.False(isValid);
            }
        }
        
        [Fact]
        public void ParseLocalNorNumberTest()
        {
            const string value = @"+47 736348237";

            string international = value.ToInternationalNumber("no");
            
            bool isValid = value.IsPhoneNumberValid("no");
            
            Assert.Null(international);
            Assert.False(isValid);
        }
        
        [Fact]
        public void ParseIncorrectCnNumberTest()
        {
            const string value = @"+86325827";

            string international = value.ToInternationalNumber("cn");
            
            bool isValid = value.IsPhoneNumberValid("cn");
            
            Assert.Null(international);
            Assert.False(isValid);
        }
        
        [Fact]
        public void ParseInternationalCnNumberTest()
        {
            const string value = @"130 219 333 00";

            string international = value.ToInternationalNumber("cn");
            
            bool isValid = value.IsPhoneNumberValid("cn");

            Assert.Equal("+8613021933300", international);
            Assert.True(isValid);
        }
        
        [Fact]
        public void ParseInternationalUaNumberTest()
        {
            const string value = @"0669911422";

            string international = value.ToInternationalNumber("ua");
            
            bool isValid = value.IsPhoneNumberValid("ua");

            Assert.Equal("+380669911422", international);
            Assert.True(isValid);
        }
    }
}