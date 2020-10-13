using System;

namespace WeAre.Athenaeum.Toolkit.Extensions
{
    public static class ExceptionExtensions
    {
        public static string ToTraceString(this Exception ex, bool addNewLine = true)
        {
            return Utility.ToTraceString(ex, addNewLine);
        }

        public static Exception GetActualException(this Exception ex)
        {
            return Utility.GetActualException(ex);
        }
    }
}