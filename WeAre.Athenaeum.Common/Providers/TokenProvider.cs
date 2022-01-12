using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using WeAre.Athenaeum.Common.Configuration.Settings;

namespace WeAre.Athenaeum.Common.Providers
{
    public class TokenProvider
    {
        private readonly TokenSettings _settings;

        public DateTime GetExpires(TokenType tokenType)
        {
            switch (tokenType)
            {
                case TokenType.Mobile:
                    return DateTime.UtcNow.AddMinutes(_settings.MobileTokenTimeoutInMinutes);

                case TokenType.Email:
                case TokenType.Login:
                    return DateTime.UtcNow.AddMinutes(_settings.EmailTokenTimeoutInMinutes);

                default:
                    return DateTime.UtcNow.AddMinutes(_settings.ServiceTokenTimeoutInMinutes);
            }
        }

        public TokenProvider(TokenSettings settings)
        {
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
        }

        public string GetJwtToken(IEnumerable<Claim> claims, DateTime expires)
        {
            if (claims == null)
                throw new ArgumentNullException(nameof(claims));

            var credentials = new SigningCredentials(_settings.SecurityKey, SecurityAlgorithms.HmacSha256);

            string issuer = _settings.Issuer;
            string audience = _settings.Issuer;

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: expires,
                signingCredentials: credentials);

            string jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return jwtToken;
        }

        public TokenInfo Validate<TTokenData>(string jwtToken, bool validateLifetime = true) where TTokenData : TokenData
        {
            var validator = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidIssuer = _settings.Issuer,
                ValidAudience = _settings.Issuer,
                IssuerSigningKey = _settings.SecurityKey,
                ValidateIssuerSigningKey = true,
                ValidateAudience = true,
                ValidateLifetime = validateLifetime,
            };

            if (validator.CanReadToken(jwtToken))
            {
                try
                {
                    ClaimsPrincipal principal = validator.ValidateToken(jwtToken, validationParameters, out _);

                    string username = principal.Claims.FirstOrDefault(claim => claim.Type == AthenaeumConstants.ClaimTypes.NameIdentifier)?.Value;
                    string securityStampClaim = principal.Claims.FirstOrDefault(claim => claim.Type == AthenaeumConstants.ClaimTypes.SecurityStamp)?.Value;
                    string tokenIdClaim = principal.Claims.FirstOrDefault(claim => claim.Type == AthenaeumConstants.ClaimTypes.TokenId)?.Value;

                    if ((!string.IsNullOrWhiteSpace(username)) &&
                        (!string.IsNullOrWhiteSpace(securityStampClaim)) && (Guid.TryParse(securityStampClaim, out Guid securityStamp)) && (securityStamp != Guid.Empty) &&
                        (!string.IsNullOrWhiteSpace(tokenIdClaim)) && (Guid.TryParse(tokenIdClaim, out Guid tokenId)) && (tokenId != Guid.Empty))
                    {
                        TTokenData userData = null;

                        if (principal.HasClaim(c => c.Type == AthenaeumConstants.ClaimTypes.UserData))
                        {
                            string userDataJson = principal.Claims.First(c => c.Type == AthenaeumConstants.ClaimTypes.UserData).Value;
                            if (!string.IsNullOrWhiteSpace(userDataJson))
                            {
                                userData = TokenData.Deserialize<TTokenData>(userDataJson);
                            }
                        }

                        return new TokenInfo
                        {
                            Id = tokenId,
                            SecurityStamp = securityStamp,
                            Username = username,
                            Data = userData
                        };
                    }
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException($"Invalid jwt token. {ex.Message}. See inner exception for details.", ex);
                }
            }

            throw new InvalidOperationException("Invalid jwt token. Unable to get Username, SecurityStamp or TokenId from token.");
        }
    }
}