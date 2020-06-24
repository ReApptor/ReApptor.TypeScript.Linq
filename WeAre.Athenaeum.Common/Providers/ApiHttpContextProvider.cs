using System;
using WeAre.Athenaeum.Common.Extensions;

namespace WeAre.Athenaeum.Common.Providers
{
    public sealed class ApiHttpContextProvider : HttpContextProvider
    {
        protected override string FindClaim(string claimType)
        {
            string name = (AthenaeumConstants.ClaimTypes.All.ContainsKey(claimType))
                ? AthenaeumConstants.ClaimTypes.All[claimType]
                : claimType;
            
            return HttpContext?.Request?.Headers.Find(name);
        }

        public ApiHttpContextProvider(IServiceProvider serviceProvider)
            : base(serviceProvider)
        {
        }
    }
}