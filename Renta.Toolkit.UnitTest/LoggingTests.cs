using DeviceDetectorNET;
using Xunit;

namespace Renta.Toolkit.UnitTest
{
    public class LoggingTests
    {
        [Fact]
        public void BrowserNameTest()
        {
            var aaa = new DeviceDetector();
            var dd = new DeviceDetector("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36");
            dd.Parse();
            var cc = dd.GetDeviceName();
            if (dd.IsBot())
            {
                // handle bots,spiders,crawlers,...
                var botInfo = dd.GetBot();
            }
            else
            {
                var clientInfo = dd.GetClient(); // holds information about browser, feed reader, media player, ...
                var osInfo = dd.GetOs();
                var device = dd.GetDeviceName();
                var brand = dd.GetBrandName();
                var model = dd.GetModel();
            }

            Assert.True(true);
        }
    }
}