using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Renta.Toolkit.Configuration;
using Renta.Toolkit.Extensions;

namespace Renta.Toolkit.Providers
{
    public class SecurityProvider //: ISecurityProvider
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IRentaConfiguration _configuration;
        private IHttpContextAccessor _accessor;
        private IAntiforgery _antiforgery;
        private HttpContextProvider _httpContextProvider;
        private TokenProvider _tokenProvider;

        private static string GenerateJwtTokenUrl(string applicationUrl, string token)
        {
            bool hasParams = applicationUrl.Contains('?');
            string separator = (hasParams) ? "&" : "?";
            token = Uri.EscapeDataString(token);
            return $"{applicationUrl}{separator}token={token}";
        }

        private static string GenerateJwtTokenShortUrl(string applicationUrl, Guid tokenId)
        {
            bool hasSeparator = applicationUrl.EndsWith('/');
            string separator = (hasSeparator) ? "" : "/";
            return $"{applicationUrl}{separator}{tokenId:N}";
        }

        private void Set(IEnumerable<Claim> claims)
        {
            if (claims == null)
                throw new ArgumentNullException(nameof(claims));

            ClaimsPrincipal user = GetPrincipal(claims);

            if (HttpContext != null)
            {
                HttpContext.User = user;
            }
            else
            {
                Thread.CurrentPrincipal = user;
            }
            
            HttpContextProvider.Clear();
        }

        public SecurityProvider(IServiceProvider serviceProvider, IRentaConfiguration configuration)
        {
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public void SignIn(ClaimsIdentity identity)
        {
            if (identity != null)
            {
                Set(identity.Claims);
            }
            else
            {
                SignOut();
            }
        }

        public void SignIn(string username)
        {
            if (username == null)
                throw new ArgumentNullException(nameof(username));
            if (string.IsNullOrWhiteSpace(username))
                throw new ArgumentOutOfRangeException(nameof(username), "Username cannot be empty or whitespace.");

            List<Claim> claims = HttpContextProvider.GetClaims(false).ToList();

            claims.Add(new Claim(RentaConstants.ClaimTypes.NameIdentifier, username));

            Set(claims);
        }

        public void SignOut()
        {
            IEnumerable<Claim> claims = HttpContextProvider.GetClaims(false);
            
            Set(claims);
        }

        public string GenerateXsrfToken()
        {
            if (HttpContext == null)
                throw new InvalidOperationException("HttpContext is not defined.");

            AntiforgeryTokenSet tokens = Antiforgery.GetAndStoreTokens(HttpContext);

            return tokens.RequestToken;
        }

        public Token GenerateJwtToken<TData>(DateTime expires, TData data, string username, Guid securityStamp, string applicationUrl = null) where TData: TokenData
        {
            if (username == null)
                throw new ArgumentNullException(nameof(username));
            if (string.IsNullOrWhiteSpace(username))
                throw new ArgumentOutOfRangeException(nameof(username), "Username is empty or whitespace.");
            if (securityStamp == null)
                throw new ArgumentNullException(nameof(securityStamp));

            var id = Guid.NewGuid();
            
            var claims = new List<Claim>
            {
                new Claim(RentaConstants.ClaimTypes.TokenId, id.ToString()),
                new Claim(RentaConstants.ClaimTypes.NameIdentifier, username),
                new Claim(RentaConstants.ClaimTypes.SecurityStamp, securityStamp.ToString()),
            };
            
            if (data != null)
            {
                string dataJson = JsonConvert.SerializeObject(data);
                claims.Add(new Claim(RentaConstants.ClaimTypes.UserData, dataJson));
            }

            string jwt = TokenProvider.GetJwtToken(claims, expires);

            string url = null;
            string shortUrl = null;

            if (!string.IsNullOrWhiteSpace(applicationUrl))
            {
                url = GenerateJwtTokenUrl(applicationUrl, jwt);
                shortUrl = GenerateJwtTokenShortUrl(applicationUrl, id);
            };

            return new Token
            {
                Id = id,
                Expires = expires,
                Jwt = jwt,
                Url = url,
                ShortUrl = shortUrl,
                Username = username,
                SecurityStamp = securityStamp,
                Data = data
            };
        }

        public Token GenerateJwtToken<TData>(TokenType tokenType, TData data, string username, Guid securityStamp, string applicationUrl = null) where TData : TokenData
        {
            DateTime expires = TokenProvider.GetExpires(tokenType);
            return GenerateJwtToken(expires, data, username, securityStamp, applicationUrl);
        }

        public Token GenerateJwtToken(TokenType tokenType, string username, Guid securityStamp, string applicationUrl = null)
        {
            return GenerateJwtToken<TokenData>(tokenType, null, username, securityStamp,  applicationUrl);
        }

        public Token GenerateJwtToken(DateTime expires, string username, Guid securityStamp, string applicationUrl = null)
        {
            return GenerateJwtToken<TokenData>(expires, null, username, securityStamp,  applicationUrl);
        }

        public Token GenerateJwtToken<TData>(TokenType tokenType, TData data) where TData : TokenData
        {
            string username = HttpContextProvider.NameIdentifier;
            Guid securityStamp = Guid.Parse(HttpContextProvider.SecurityStamp);
            return GenerateJwtToken(tokenType, data, username, securityStamp);
        }

        public Token GenerateJwtToken(TokenType tokenType)
        {
            string username = HttpContextProvider.NameIdentifier;
            Guid securityStamp = Guid.Parse(HttpContextProvider.SecurityStamp);
            return GenerateJwtToken(tokenType, username, securityStamp);
        }

        public IHttpContextAccessor Accessor
        {
            get { return _accessor ?? (_accessor = (IHttpContextAccessor) _serviceProvider.GetService(typeof(IHttpContextAccessor))); }
        }

        public HttpContext HttpContext
        {
            get { return Accessor?.HttpContext; }
        }

        public IAntiforgery Antiforgery
        {
            get { return _antiforgery ?? (_antiforgery = _serviceProvider.GetRequiredService<IAntiforgery>()); }
        }

        public HttpContextProvider HttpContextProvider
        {
            get { return _httpContextProvider ?? (_httpContextProvider = _serviceProvider.GetRequiredService<HttpContextProvider>()); }
        }

        public TokenProvider TokenProvider
        {
            get { return _tokenProvider ?? (_tokenProvider = _serviceProvider.GetRequiredService<TokenProvider>()); }
        }

        public virtual ClaimsIdentity Caller
        {
            get
            {
                return (Accessor?.HttpContext?.User?.Identity as ClaimsIdentity)
                       ?? (Thread.CurrentPrincipal?.Identity as ClaimsIdentity);
            }
        }

        public virtual string CallerUsername
        {
            get
            {
                if (_configuration.IsPackageManagerConsole)
                {
                    return RentaConstants.Db.PackageConsoleUser;
                }

                return Caller.NameIdentifier();
            }
        }

        public bool IsAuthenticated
        {
            get { return Caller.IsAuthenticated(); }
        }

        #region Static

        public static ClaimsPrincipal GetPrincipal(IEnumerable<Claim> claims)
        {
            if (claims == null)
                throw new ArgumentNullException(nameof(claims));

            var identity = new RentaClaimsIdentity(claims);

            var user = new ClaimsPrincipal(identity);

            return user;
        }

        #endregion
    }
}