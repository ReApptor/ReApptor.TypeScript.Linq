using System;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Localization;
using WeAre.Athenaeum.Toolkit;
using SystemClaimTypes = System.Security.Claims.ClaimTypes;

namespace WeAre.Athenaeum.TemplateApp.Common
{
    public static class TestApplicationConstants
    {
        /// <summary>
        /// "TestApplication"
        /// </summary>
        public const string ApplicationName = @"TestApplication";

        /// <summary>
        /// "Test Application"
        /// </summary>
        public const string ApplicationTitle = @"Test Application";

        /// <summary>
        /// "WeAre TestApplication BE API"
        /// </summary>
        public const string ApiTitle = @"WeAre TestApplication BE API";

        /// <summary>
        /// "testapplication"
        /// </summary>
        public const string AuthenticationType = "testapplication";

        public const string XsrfTokenName = @"xsrf-token";

        public static readonly CultureInfo[] SupportedCultures =
        {
            new CultureInfo("fi-FI"),
            new CultureInfo("sv-SE"),
            new CultureInfo("en-US"),
            new CultureInfo("pl-PL"),
        };

        public static readonly CultureInfo DefaultCulture = SupportedCultures.First();
        
        public static readonly RequestCulture DefaultRequestCulture = new RequestCulture(DefaultCulture);

                public static class Localization
        {
            public static readonly CultureInfo[] SupportedCultures =
            {
                new CultureInfo("fi-FI"),
                new CultureInfo("sv-SE"),
                //new CultureInfo("nb-NO"),
                new CultureInfo("en-US"),
                //new CultureInfo("pl-PL"),
            };

            public static readonly CultureInfo DefaultCulture = SupportedCultures.First();

            public static readonly RequestCulture DefaultRequestCulture = new RequestCulture(DefaultCulture);
        }
        
        public static class Http
        {
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

        public static class DefaultAppSettings
        {
            /// <summary>
            /// "0.4 Euro per kilometer"
            /// </summary>
            public const double MileagePrice = 0.4;
            
            /// <summary>
            /// "42 Euro per hour"
            /// </summary>
            public const double HourPrice = 42;
        }

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
            /// "datetime"
            /// </summary>
            public const string DatabaseDateTimeType = @"datetime";

            /// <summary>
            /// "migration.console@weare.fi"
            /// </summary>
            public const string MigrationConsoleUser = "migration.console@weare.fi";

            /// <summary>
            /// "package.console@weare.fi"
            /// </summary>
            public const string PackageConsoleUser = "package.console@weare.fi";
        }

        public static class Ui
        {
            /// <summary>
            /// "Home"
            /// </summary>
            public const string HomePageRoute = "Home";

            /// <summary>
            /// "Dashboard"
            /// </summary>
            public const string DashboardPageRoute = "Dashboard";

            /// <summary>
            /// "RentaTasks/Dashboard"
            /// </summary>
            public const string RentaTasksPageRoute = "RentaTasks/Dashboard";
            
            /// <summary>
            /// "Login"
            /// </summary>
            public const string LoginPageRoute = "Login";

            /// <summary>
            /// "Account"
            /// </summary>
            public const string AccountPageRoute = "Account";
            
            /// <summary>
            /// "Logout"
            /// </summary>
            public const string LogoutPageRoute = "Logout";
            
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

            public static readonly string[] NotAuthorizedPageRoutes = { HomePageRoute, LoginPageRoute, ErrorPageRoute, ContactSupportPageRoute };
            
            /// <summary>
            /// "2 Mb"
            /// </summary>
            public const int MaxAjaxRequestSizeInBytes = 2 * 1024 * 1024;

            /// <summary>
            /// "10 Mb"
            /// </summary>
            public const int MaxFileUploadSizeInBytes = 10 * 1024 * 1024;

            /// <summary>
            /// "51 Mb"
            /// </summary>
            public const int MaxImageRequestSizeInBytes = 51 * 1024 * 1024;
            
            public static readonly TimeZoneInfo DefaultTimeZone = Utility.GetTimeZone("Europe/Helsinki", "FLE Standard Time");

            public static readonly TimeSpan DefaultTimeZoneOffset = Utility.GetTimezoneOffset(DefaultTimeZone);

            /// <summary>
            /// "MobileToken"
            /// </summary>
            public const string MobileTokenCookie = "MobileToken";

            /// <summary>
            /// 7 days back
            /// </summary>
            public const int DefaultTrackingDaysBack = 7;

            /// <summary>
            /// "10"
            /// </summary>
            public const int MaxCompletedWorkOrders = 10;
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

        public static class Sync
        {
            /// <summary>
            /// "10 minutes before sync invoked"
            /// </summary>
            public const int DelayInMinutes = 10;

            /// <summary>
            /// "30 minutes limit for sync invoking"
            /// </summary>
            public const int WatchdogDelayInMinutes = 30;
        }

        public static class Password
        {
            /// <summary>
            /// "6"
            /// </summary>
            public const int MinLength = 6;
            
            /// <summary>
            /// "100"
            /// </summary>
            public const int MaxLength = 100;
        }
        
        public static class Notification
        {
            /// <summary>
            /// "Set 8.5 of working hours if user has been logged out because of 'SignOutExpirationTimeOut'"
            /// </summary>
            public const double DailyWorkingHours = 8.5;
            
            /// <summary>
            /// "If user has been signed in 12h straight then send a notification"
            /// </summary>
            public const int SignOutExpirationNotification = 12;
            
            /// <summary>
            /// "If user has been signed in more than 15 hours straight throw user out"
            /// </summary>
            public const int SignOutExpirationTimeOut = 15;
        }
    }
}