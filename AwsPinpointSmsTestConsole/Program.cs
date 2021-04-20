using System;
using Renta.Apps.Common.Configuration.Settings;
using WeAre.Athenaeum.Services.Sms.Implementation;
using WeAre.Athenaeum.Services.Sms.Models;

namespace AwsPinpointSmsTestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Console.WriteLine("Send sms - start");
                var awsPinpoint = new AwsPinpointSmsService(new AwsSettings
                {
                    Profile = "dev-athenaeum",
                    Region = "eu-west-1",
                    AwsPinpointAppId = "e5d655865a594134994366c6a2e81151",
                    AwsPinpointSenderId = "DevWeAre"
                });

                awsPinpoint.SendAsync(new SmsMessage
                {
                    Message = "Juhani testaa",
                    Receiver = "+358407422626"
                }).GetAwaiter().GetResult();
                Console.WriteLine("Send sms - end");
            }
            catch (Exception e)
            {
                Console.WriteLine("Send sms error:");

                Console.WriteLine(e);
            }
        }
    }
}