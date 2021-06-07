using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Amazon;
using Amazon.Pinpoint;
using Amazon.Pinpoint.Model;
using Amazon.SecurityToken;
using Amazon.SecurityToken.Model;
using Newtonsoft.Json;
using Renta.Apps.Common.Configuration.Settings;
using WeAre.Athenaeum.Services.Sms.Interface;
using WeAre.Athenaeum.Services.Sms.Models;

namespace WeAre.Athenaeum.Services.Sms.Implementation
{
    public class AwsPinpointSmsService : ISmsService
    {
        #region Private

        // The type of SMS message that you want to send. If you plan to send
        // time-sensitive content, specify TRANSACTIONAL. If you plan to send
        // marketing-related content, specify PROMOTIONAL.
        private const string MessageType = "TRANSACTIONAL";

        private readonly AwsSettings _settings;

        private static SendMessagesRequest CreateSendMessagesRequest(SmsMessage message, AwsSettings settings)
        {
            var smsMessage = new SMSMessage
            {
                Body = message.Message,
                MessageType = MessageType,
                SenderId = settings.AwsPinpointSenderId
            };
            if (!string.IsNullOrWhiteSpace(settings.AwsPinpointOriginationNumber))
            {
                smsMessage.OriginationNumber = settings.AwsPinpointOriginationNumber;
            }

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
                        SMSMessage = smsMessage
                    }
                }
            };
            return sendRequest;
        }

        #endregion

        public AwsPinpointSmsService(AwsSettings settings)
        {
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
        }

        public async Task<SmsResponse> SendAsync(SmsMessage message)
        {
            if (message == null)
                throw new ArgumentNullException(nameof(message));
            if (string.IsNullOrWhiteSpace(message.Receiver))
                throw new ArgumentOutOfRangeException(nameof(message), $"{nameof(message.Receiver)} is null, empty or whitespace.");
            if (string.IsNullOrWhiteSpace(message.Message))
                throw new ArgumentOutOfRangeException(nameof(message), $"{nameof(message.Message)} is null, empty or whitespace.");

            using AmazonSecurityTokenServiceClient amazonSecurityTokenServiceClient = new AmazonSecurityTokenServiceClient(RegionEndpoint.GetBySystemName(_settings.Region));

            AssumeRoleResponse response = await amazonSecurityTokenServiceClient.AssumeRoleAsync(new AssumeRoleRequest
            {
                RoleArn = _settings.AwsPinpointRoleArn,
                RoleSessionName = "RoleSession1"
            });

            using AmazonPinpointClient client = new AmazonPinpointClient(response.Credentials, RegionEndpoint.GetBySystemName(_settings.Region));

            SendMessagesRequest request = CreateSendMessagesRequest(message, _settings);

            SendMessagesResponse smsResponse = await client.SendMessagesAsync(request);

            if (smsResponse.HttpStatusCode == HttpStatusCode.OK)
            {
                return new SmsResponse
                {
                    Success = true
                };
            }

            return new SmsResponse
            {
                Error = JsonConvert.SerializeObject(smsResponse.MessageResponse)
            };
        }
    }
}