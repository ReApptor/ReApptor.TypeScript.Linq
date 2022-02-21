namespace WeAre.ReApptor.Services.Sms.Models
{
    public class SmsMessage
    {
        #region Constructors

        public SmsMessage()
        {
        }

        public SmsMessage(string receiver, string message)
        {
            Receiver = receiver;
            Message = message;
        }

        #endregion

        #region Properties

        /// <summary>
        /// receiver of the message
        /// </summary>
        public string Receiver { get; set; }
        

        /// <summary>
        /// The message to send
        /// </summary>
        public string Message { get; set; }

        #endregion
    }
}