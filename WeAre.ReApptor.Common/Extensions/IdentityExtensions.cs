using System.Security.Claims;
using System.Security.Principal;

namespace WeAre.ReApptor.Common.Extensions
{
    public static class IdentityExtensions
    {
        public static string Find(this IIdentity identity, string claimType)
        {
            if (!string.IsNullOrWhiteSpace(claimType))
            {
                var claims = identity as ClaimsIdentity;
                string value = claims?.FindFirst(claimType)?.Value;
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return value;
                }
            }

            return null;
        }

        public static string Language(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.Language);
        }

        public static string BrowserId(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.BrowserId);
        }

        public static string UserAgent(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.UserAgent);
        }

        public static string SecurityStamp(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.SecurityStamp);
        }

        public static string NameIdentifier(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.NameIdentifier);
        }

        public static string Email(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.Email);
        }

        public static string Phone(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.Phone);
        }

        public static string SessionId(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.SessionId);
        }

        public static string Country(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.Country);
        }

        public static string UserData(this IIdentity identity)
        {
            return Find(identity, AthenaeumConstants.ClaimTypes.UserData);
        }

        public static bool IsAuthenticated(this IIdentity identity)
        {
            return (identity?.IsAuthenticated == true);
        }
    }
}