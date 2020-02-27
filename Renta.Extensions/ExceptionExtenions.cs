using System;

namespace Renta.Extensions
{
    public static class ExceptionExtenions
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