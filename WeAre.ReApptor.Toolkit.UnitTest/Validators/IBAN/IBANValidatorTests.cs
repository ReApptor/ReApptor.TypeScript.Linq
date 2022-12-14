using WeAre.ReApptor.Common.Validators.IBAN;
using WeAre.ReApptor.Toolkit.Validators;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest.Validators.IBAN
{
    public class IBANValidatorTests
    {
        [Fact]
        public void TenantService_IBANValidator_IsValid_FI8130313610307016()
        {
            Assert.True(IBANValidator.IsValid("FI8130313610307016"));
        }

        [Fact]
        public void TenantService_BICValidator_IsValid_MHCBJPJTXXX()
        {
            Assert.True(BICValidator.IsValid("MHCBJPJTXXX"));
        }
    }
}