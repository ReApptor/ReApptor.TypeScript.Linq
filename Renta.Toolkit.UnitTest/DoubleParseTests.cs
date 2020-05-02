using System.Globalization;
using System.Threading;
using Renta.Toolkit.Extensions;
using Xunit;

namespace Renta.Toolkit.UnitTest
{
    public sealed class DoubleParseTests
    {
        private void Init()
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("fi");
        }
        
        [Fact]
        public void IntParseTest()
        {
            Init();
            Assert.Equal(10, "10".ToDouble());
        }
        
        [Fact]
        public void DoubleParseTest()
        {
            Init();
            const double value = 1.1;
            Assert.Equal(value, value.ToString(CultureInfo.InvariantCulture).ToDouble());
        }

        [Fact]
        public void DoubleDotSeparatorParseTest()
        {
            Init();
            Assert.Equal(1.1, "1.1".ToDouble());
        }

        [Fact]
        public void DoubleCommaSeparatorParseTest()
        {
            Init();
            Assert.Equal(1.1, "1,1".ToDouble());
        }
        
        [Fact]
        public void IntDotSeparatorParseTest()
        {
            Init();
            Assert.Equal(1, "1.".ToDouble());
        }
        
        [Fact]
        public void IntCommaSeparatorParseTest()
        {
            Init();
            Assert.Equal(1, "1,".ToDouble());
        }
    }
}