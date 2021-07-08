using WeAre.Athenaeum.Common;
using WeAre.Athenaeum.Common.Extensions;
using Xunit;

namespace WeAre.Athenaeum.Toolkit.UnitTest.Extensions
{
    public class EnumExtensionsTests
    {
        [Fact]
        public void GetEnumNameTest()
        {
            const WebApplicationType type = WebApplicationType.MobileApp;

            string enumValue = type.GetEnumName();
            
            Assert.Equal("MobileApp", enumValue);
        }
    }
}