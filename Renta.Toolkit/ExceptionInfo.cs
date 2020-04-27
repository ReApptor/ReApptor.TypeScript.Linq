using System;
using System.Diagnostics;

namespace Renta.Toolkit
{
    [Serializable]
    [DebuggerDisplay("{Type}:{Message}")]
    public sealed class ExceptionInfo
    {
        #region Constructors

        public ExceptionInfo()
        {
        }

        public ExceptionInfo(Exception ex)
        {
            if (ex == null)
                throw new ArgumentNullException(nameof(ex));

            Message = ex.Message;
            Type = ex.GetType().FullName;
            StackTrace = ex.StackTrace;
            
            try
            {
                BinaryData = BinarySerializer.Serialize(ex);
            }
            catch (Exception)
            {
                BinaryData = null;
            }

            InnerException = (ex.InnerException != null) ? new ExceptionInfo(ex.InnerException) : null;

            if (!ex.Data.Contains(ExceptionInfoKey))
            {
                ex.Data.Add(ExceptionInfoKey, this);
            }
        }

        #endregion

        #region Methods

        public Exception GetException()
        {
            try
            {
                return BinarySerializer.Deserialize<Exception>(BinaryData);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string ToTraceString()
        {
            string newline = Environment.NewLine;
            string message = $"Message: '{Message}' {newline}Type: '{Type}' {newline}";
            message += $" StackTrace: '{StackTrace}' {newline}";
            if (InnerException != null)
            {
                message += $" InnerExceptionMessage:{newline}{InnerException.ToTraceString()}";
            }
            message = message.Trim() + newline;
            return message;
        }

        #endregion

        #region Properties

        public string Message { get; set; }

        public string Type { get; set; }

        public string StackTrace { get; set; }

        public ExceptionInfo InnerException { get; set; }

        public byte[] BinaryData { get; set; }

        #endregion

        #region Static

        public static implicit operator ExceptionInfo(Exception ex)
        {
            return (ex != null) ? new ExceptionInfo(ex) : null;
        }

        #endregion

        #region Constants

        /// <summary>
        /// "ExceptionInfo"
        /// </summary>
        public const string ExceptionInfoKey = @"ExceptionInfo";

        #endregion
    }
}