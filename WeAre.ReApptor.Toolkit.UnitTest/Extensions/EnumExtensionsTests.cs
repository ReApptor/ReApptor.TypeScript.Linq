using WeAre.ReApptor.Common;
using WeAre.ReApptor.Common.Extensions;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest.Extensions
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