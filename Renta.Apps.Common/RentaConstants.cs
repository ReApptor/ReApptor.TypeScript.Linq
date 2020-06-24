using System;
using Renta.Toolkit;

namespace Renta.Apps.Common
{
    public static class RentaConstants
    {
        public static class Db
        {
            /// <summary>
            /// "255" (Email, Name, Key, etc.)
            /// </summary>
            public const int KeyLength = 255;

            /// <summary>
            /// "1024"
            /// </summary>
            public const int DescriptionLength = 1024;

            /// <summary>
            /// "10000"
            /// </summary>
            public const int BigStringLength = 10000;

            /// <summary>
            /// "32"
            /// </summary>
            public const int HashLength = 32;

            /// <summary>
            /// "2"
            /// </summary>
            public const int CountryCodeLength = 2;

            /// <summary>
            /// "datetime"
            /// </summary>
            public const string DatabaseDateTimeType = @"datetime";

            /// <summary>
            /// "migration.console@renta.fi"
            /// </summary>
            public const string MigrationConsoleUser = @"migration.console@renta.fi";

            /// <summary>
            /// "package.console@renta.fi"
            /// </summary>
            public const string PackageConsoleUser = @"package.console@renta.fi";
        }

        public static class Ui
        {
            public static readonly TimeZoneInfo DefaultTimeZone = Utility.GetTimeZone("Europe/Helsinki", "FLE Standard Time");

            public static readonly TimeSpan DefaultTimeZoneOffset = Utility.GetTimezoneOffset(DefaultTimeZone);
            
            /// <summary>
            /// "1024 pixels"
            /// </summary>
            public const int MaxImageSizeInPixels = 1024;

            /// <summary>
            /// "MobileToken"
            /// </summary>
            public const string MobileTokenCookie = "MobileToken";
        }

        public static class Security
        {
            /// <summary>
            /// "5 attempts per day"
            /// </summary>
            public const int MaxDailyResetPasswordCount = 5;

            /// <summary>
            /// "24 hours"
            /// </summary>
            public const int ResetPasswordTokenTimeoutInHours = 24;
        }
    }
}