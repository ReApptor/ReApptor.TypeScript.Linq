using System;
using System.Collections.Generic;
using System.Linq;
using Renta.Components.Common.Providers;
using Renta.Toolkit;
using SystemClaimTypes = System.Security.Claims.ClaimTypes;

namespace Renta.Components.Common
{
    public static class RentaConstants
    {
        /// <summary>
        /// "renta" 
        /// </summary>
        public const string AuthenticationType = "rentaAuthentication";

        public static class Db
        {
            /// <summary>
            /// "256" (Email, Name, Key, etc.)
            /// </summary>
            public const int KeyLength = 256;

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

            /// <summary>
            /// "48 hours"
            /// </summary>
            public const int TempFileTtlInHours = 48;
        }

        public static class Ui
        {
            /// <summary>
            /// "Home"
            /// </summary>
            public const string HomePageRoute = "Home";

            /// <summary>
            /// "Dashboard" (Search device)
            /// </summary>
            public const string DashboardPageRoute = "Dashboard";

            /// <summary>
            /// "Login"
            /// </summary>
            public const string LoginPageRoute = "Login";

            /// <summary>
            /// "Error"
            /// </summary>
            public const string ErrorPageRoute = "Error";

            /// <summary>
            /// "Support"
            /// </summary>
            public const string ContactSupportPageRoute = "ContactSupport";

            /// <summary>
            /// "ChangePassword"
            /// </summary>
            public const string ChangePasswordPageRoute = "ChangePassword";

            /// <summary>
            /// "ResetPassword"
            /// </summary>
            public const string ResetPasswordPageRoute = "ResetPassword";

            public static readonly string[] NotAuthorizedPageRoutes = {HomePageRoute, LoginPageRoute, ErrorPageRoute, ContactSupportPageRoute};

            /// <summary>
            /// "2 Mb"
            /// </summary>
            public const int MaxAjaxRequestSizeInBytes = 2 * 1024 * 1024;

            /// <summary>
            /// "15 Mb"
            /// </summary>
            public const int MaxImageRequestSizeInBytes = 15 * 1024 * 1024;

            /// <summary>
            /// "15 Mb"
            /// </summary>
            public const int MaxReportRequestSizeInBytes = 15 * 1024 * 1024;

            /// <summary>
            /// ""1024 pixels
            /// </summary>
            public const int MaxImageSizeInPixels = 1024;

            /// <summary>
            /// "10 Mb"
            /// </summary>
            public const int MaxFileUploadSizeInBytes = 10 * 1024 * 1024;

            public static readonly TimeZoneInfo DefaultTimeZone = Utility.GetTimeZone("Europe/Helsinki", "FLE Standard Time");

            public static readonly TimeSpan DefaultTimeZoneOffset = Utility.GetTimezoneOffset(DefaultTimeZone);

            /// <summary>
            /// "10 days"
            /// </summary>
            public const int DeletedUserExpirationInDays = 10;

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

        public static class Http
        {
            public const string SessionIdTag = "__sessionId";

            public const string BrowserIdTag = "__browserId";

            /// <summary>
            /// "application/json"
            /// </summary>
            public const string ApiContextType = "application/json";

            /// <summary>
            /// "application/octet-stream"
            /// </summary>
            public const string DefaultMimeType = @"application/octet-stream";

            /// <summary>
            /// "application/pdf"
            /// </summary>
            public const string PdfMimeType = @"application/pdf";
        }

        public static class ClaimTypes
        {
            public const string NameIdentifier = SystemClaimTypes.NameIdentifier;

            public const string Email = SystemClaimTypes.Email;

            public const string Phone = SystemClaimTypes.MobilePhone;

            public const string SessionId = SystemClaimTypes.SerialNumber;

            public const string Country = SystemClaimTypes.Country;

            public const string UserData = SystemClaimTypes.UserData;

            public const string Language = "Language";

            public const string BrowserId = "BrowserId";

            public const string UserAgent = "UserAgent";

            public const string SecurityStamp = "SecutityStamp";

            public const string TokenId = "TokenId";

            public static readonly Dictionary<string, string> All = new Dictionary<string, string>
            {
                {NameIdentifier, nameof(HttpContextProvider.NameIdentifier)},
                {Email, nameof(HttpContextProvider.Email)},
                {Phone, nameof(HttpContextProvider.Phone)},
                {SessionId, nameof(HttpContextProvider.SessionId)},
                {Country, nameof(HttpContextProvider.Country)},
                {UserData, nameof(HttpContextProvider.UserData)},
                {Language, nameof(HttpContextProvider.Language)},
                {BrowserId, nameof(HttpContextProvider.BrowserId)},
                {UserAgent, nameof(HttpContextProvider.UserAgent)},
                {SecurityStamp, nameof(HttpContextProvider.SecurityStamp)}
            };

            public static readonly Dictionary<string, string> Identity = new Dictionary<string, string>
            {
                {NameIdentifier, nameof(HttpContextProvider.NameIdentifier)},
                {Email, nameof(HttpContextProvider.Email)},
            };
        }
    }
}