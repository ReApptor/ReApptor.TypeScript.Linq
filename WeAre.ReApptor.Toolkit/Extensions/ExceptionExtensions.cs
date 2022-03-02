﻿using System;

namespace WeAre.ReApptor.Toolkit.Extensions
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