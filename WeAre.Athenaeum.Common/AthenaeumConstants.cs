using System.Collections.Generic;
using WeAre.Athenaeum.Common.Providers;
using SystemClaimTypes = System.Security.Claims.ClaimTypes;

namespace WeAre.Athenaeum.Common
{
    public class AthenaeumConstants
    {
        /// <summary>
        /// "AthenaeumAuth" 
        /// </summary>
        public const string AuthenticationType = "AthenaeumAuth";

        /// <summary>
        /// "50 virtual threads per 1 core"
        /// </summary>
        public const int ThreadsPerCore = 50;
        
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

        public static class Api
        {
            public const string ApiHeaderKey = "x-api-key";
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
            /// "text/html"
            /// </summary>
            public const string TextMimeType = "text/html";

            /// <summary>
            /// "application/octet-stream"
            /// </summary>
            public const string DefaultMimeType = @"application/octet-stream";

            /// <summary>
            /// "application/pdf"
            /// </summary>
            public const string PdfMimeType = @"application/pdf";
            
            /// <summary>
            /// "Terraform vendor specific (custom) content type"
            /// </summary>
            public const string TerraformVendorMimeType = @"application/vnd.api+json";
            
            /// <summary>
            /// An array of custom mime types that has to be set in content type without a charset
            /// </summary>
            public static readonly string[] CustomMimeTypesWithoutEncoding = {TerraformVendorMimeType};
        }
    }
}