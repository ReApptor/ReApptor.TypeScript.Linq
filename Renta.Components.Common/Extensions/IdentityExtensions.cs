using System.Security.Claims;
using System.Security.Principal;

namespace Renta.Components.Common.Extensions
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
            return Find(identity, RentaConstants.ClaimTypes.Language);
        }

        public static string BrowserId(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.BrowserId);
        }

        public static string UserAgent(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.UserAgent);
        }

        public static string SecurityStamp(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.SecurityStamp);
        }

        public static string NameIdentifier(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.NameIdentifier);
        }

        public static string Email(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.Email);
        }

        public static string Phone(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.Phone);
        }

        public static string SessionId(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.SessionId);
        }

        public static string Country(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.Country);
        }

        public static string UserData(this IIdentity identity)
        {
            return Find(identity, RentaConstants.ClaimTypes.UserData);
        }

        public static bool IsAuthenticated(this IIdentity identity)
        {
            return (identity?.IsAuthenticated == true);
        }
    }
}