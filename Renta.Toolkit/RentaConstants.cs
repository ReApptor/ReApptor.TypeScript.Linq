using System.Collections.Generic;
using Renta.Toolkit.Providers;
using SystemClaimTypes = System.Security.Claims.ClaimTypes;

namespace Renta.Toolkit
{
    public static  class RentaConstants
    {
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