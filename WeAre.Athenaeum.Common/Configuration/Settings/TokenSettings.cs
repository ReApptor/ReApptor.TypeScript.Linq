using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace WeAre.Athenaeum.Common.Configuration.Settings
{
    public sealed class TokenSettings : IOptions<TokenSettings>
    {
        TokenSettings IOptions<TokenSettings>.Value => this;

        /// <summary>
        /// Service token timeout: 31 days by default
        /// </summary>
        public int ServiceTokenTimeoutInMinutes { get; set; }

        /// <summary>
        /// Mobile token timeout: 365 days by default
        /// </summary>
        public int MobileTokenTimeoutInMinutes { get; set; }

        /// <summary>
        /// Email token timeout for links in email, 7 days by default
        /// </summary>
        public int EmailTokenTimeoutInMinutes { get; set; }

        public SymmetricSecurityKey SecurityKey { get; set; }

        public string Issuer { get; set; }
    }
}