using System;
using System.Collections.Generic;
using System.Reflection;
using System.Security.Claims;
using System.Threading;
using Microsoft.AspNetCore.Http;
using WeAre.Athenaeum.Toolkit.Extensions;
using WeAre.Athenaeum.Common.Extensions;

namespace WeAre.Athenaeum.Common.Providers
{
    public class HttpContextProvider
    {
        #region Private/Protected

        private readonly IServiceProvider _serviceProvider;
        private IHttpContextAccessor _accessor;
        private string _scopeId;
        private string _nameIdentifier;
        private string _email;
        private string _phone;
        private string _browserId;
        private string _userAgent;
        private string _languageId;
        private string _country;
        private string _securityStamp;
        private string _sessionId;
        private string _userData;

        private static string FindFromCaller(ClaimsIdentity caller, string claimType)
        {
            return caller?.Find(claimType);
        }

        protected virtual string FindClaim(string claimType)
        {
            return null;
        }

        private string Find(string claimType)
        {
            return FindFromCaller(Caller, claimType) ?? FindClaim(claimType);
        }

        private void ValidateCache()
        {
            string traceIdentifier = GetTraceIdentifier();
            if (_scopeId != traceIdentifier)
            {
                Clear();
                _scopeId = traceIdentifier;
            }
        }

        #endregion

        #region Constructors/Methods

        public HttpContextProvider(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            _scopeId = GetTraceIdentifier();
        }

        public string FindClaimValue(string claimType)
        {
            if (!string.IsNullOrWhiteSpace(claimType))
            {
                if (AthenaeumConstants.ClaimTypes.All.ContainsKey(claimType))
                {
                    claimType = AthenaeumConstants.ClaimTypes.All[claimType];
                }

                PropertyInfo property = ReflectionExtensions.FindProperty(typeof(HttpContextProvider), claimType);
                if (property != null)
                {
                    return property.QuickGetValue<string>(this);
                }
            }

            return null;
        }

        public IEnumerable<KeyValuePair<string, string>> GetClaimValues(bool withClaimType = false)
        {
            IEnumerable<Claim> claims = GetClaims();
            foreach (Claim claim in claims)
            {
                string claimType = claim.Type;
                string value = claim.Value;
                if (!string.IsNullOrWhiteSpace(value))
                {
                    string claimId = ((withClaimType) || (!AthenaeumConstants.ClaimTypes.All.ContainsKey(claimType)))
                        ? claimType
                        : (AthenaeumConstants.ClaimTypes.All[claimType]);
                    yield return new KeyValuePair<string, string>(claimId, value);
                }
            }
        }

        public IEnumerable<Claim> GetClaims(bool includeIdentity = true)
        {
            foreach (KeyValuePair<string, string> item in AthenaeumConstants.ClaimTypes.All)
            {
                string claimType = item.Key;
                if ((includeIdentity) || (!AthenaeumConstants.ClaimTypes.Identity.ContainsKey(claimType)))
                {
                    string value = FindClaimValue(claimType);
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        yield return new Claim(claimType, value);
                    }
                }
            }
        }

        public void Clear()
        {
            _nameIdentifier = null;
            _email = null;
            _phone = null;
            _browserId = null;
            _languageId = null;
            _country = null;
            _securityStamp = null;
            _sessionId = null;
            _userData = null;
        }

        public string GetTraceIdentifier()
        {
            return HttpContext?.TraceIdentifier;
        }

        #endregion

        #region Properties

        public IHttpContextAccessor Accessor
        {
            get { return _accessor ??= _serviceProvider.GetService(typeof(IHttpContextAccessor)) as IHttpContextAccessor; }
        }

        public HttpContext HttpContext
        {
            get { return Accessor?.HttpContext; }
        }

        public HttpRequest HttpRequest
        {
            get { return HttpContext?.Request; }
        }

        public ClaimsIdentity Caller
        {
            get { return (HttpContext?.User?.Identity as ClaimsIdentity) ?? (Thread.CurrentPrincipal?.Identity as ClaimsIdentity); }
        }

        #endregion

        #region Claim Values

        public string NameIdentifier
        {
            get
            {
                ValidateCache();
                return _nameIdentifier ??= Find(AthenaeumConstants.ClaimTypes.NameIdentifier);
            }
        }

        public string Email
        {
            get
            {
                ValidateCache();
                return _email ??= Find(AthenaeumConstants.ClaimTypes.Email);
            }
        }

        public string Phone
        {
            get
            {
                ValidateCache();
                return _phone ??= Find(AthenaeumConstants.ClaimTypes.Phone);
            }
        }

        public string BrowserId
        {
            get
            {
                ValidateCache();
                return _browserId ??= Find(AthenaeumConstants.ClaimTypes.BrowserId);
            }
        }

        public string UserAgent
        {
            get
            {
                ValidateCache();
                return _userAgent ??= Find(AthenaeumConstants.ClaimTypes.UserAgent);
            }
        }

        public string SessionId
        {
            get
            {
                ValidateCache();
                return _sessionId ??= Find(AthenaeumConstants.ClaimTypes.SessionId);
            }
        }

        public string Language
        {
            get
            {
                ValidateCache();
                return _languageId ??= Find(AthenaeumConstants.ClaimTypes.Language);
            }
        }

        public string Country
        {
            get
            {
                ValidateCache();
                return _country ??= Find(AthenaeumConstants.ClaimTypes.Country);
            }
        }

        public string SecurityStamp
        {
            get
            {
                ValidateCache();
                return _securityStamp ??= Find(AthenaeumConstants.ClaimTypes.SecurityStamp);
            }
        }

        public string UserData
        {
            get
            {
                ValidateCache();
                return _userData ??= Find(AthenaeumConstants.ClaimTypes.UserData);
            }
        }

        #endregion
    }
}