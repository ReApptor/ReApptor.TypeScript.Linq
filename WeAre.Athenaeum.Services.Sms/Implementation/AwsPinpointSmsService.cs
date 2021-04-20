using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon;
using Amazon.Pinpoint;
using Amazon.Pinpoint.Model;
using Amazon.Runtime;
using Renta.Apps.Common.Configuration.Settings;
using WeAre.Athenaeum.Services.Sms.Interface;
using WeAre.Athenaeum.Services.Sms.Models;

namespace WeAre.Athenaeum.Services.Sms.Implementation
{
    public class AwsPinpointSmsService : ISmsService
    {
        private readonly AwsSettings _settings;


        // The type of SMS message that you want to send. If you plan to send
        // time-sensitive content, specify TRANSACTIONAL. If you plan to send
        // marketing-related content, specify PROMOTIONAL.
        private static readonly string messageType = "TRANSACTIONAL";

        public AwsPinpointSmsService(AwsSettings settings)
        {
            _settings = settings;
        }

        public async Task SendAsync(SmsMessage message)
        {
            if (message == null)
                throw new ArgumentNullException(nameof(message));
            if (string.IsNullOrWhiteSpace(message.Receiver))
                throw new ArgumentNullException(nameof(message.Receiver));
            if (string.IsNullOrWhiteSpace(message.Message))
                throw new ArgumentNullException(nameof(message.Message));

            using AmazonPinpointClient client = new AmazonPinpointClient(RegionEndpoint.GetBySystemName(_settings.Region));
            SendMessagesRequest sendRequest = CreateSendMessagesRequest(message, _settings);

            await client.SendMessagesAsync(sendRequest);
        }

        private static SendMessagesRequest CreateSendMessagesRequest(SmsMessage message, AwsSettings settings)
        {
            var sendRequest = new SendMessagesRequest
            {
                ApplicationId = settings.AwsPinpointAppId,
                MessageRequest = new MessageRequest
                {
                    Addresses = new Dictionary<string, AddressConfiguration>
                    {
                        {
                            message.Receiver,
                            new AddressConfiguration
                            {
                                ChannelType = "SMS"
                            }
                        }
                    },
                    MessageConfiguration = new DirectMessageConfiguration
                    {
                        SMSMessage = new SMSMessage
                        {
                            Body = message.Message,
                            MessageType = messageType,
                            OriginationNumber = settings.AwsPinpointOriginationNumber,
                            SenderId = settings.AwsPinpointSenderId
                        }
                    }
                }
            };
            return sendRequest;
        }
    }
}