using System;
using System.Security.Claims;

namespace WeAre.Athenaeum.Common.Providers
{
    public sealed class SecurityProviderOptions
    {
        public string AuthenticationType { get; set; } = AthenaeumConstants.AuthenticationType;

        public string PackageConsoleUser { get; set; }

        public Func<ClaimsIdentity, string> CallerUsername { get; set; }
    }
}