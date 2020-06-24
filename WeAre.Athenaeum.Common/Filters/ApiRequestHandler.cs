using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using WeAre.Athenaeum.Common.Extensions;
using WeAre.Athenaeum.Common.Providers;

namespace WeAre.Athenaeum.Common.Filters
{
    public sealed class ApiRequestHandler : DelegatingHandler
    {
        private readonly HttpContextProvider _httpContextProvider;

        public ApiRequestHandler(HttpContextProvider httpContextProvider)
        {
            _httpContextProvider = httpContextProvider ?? throw new ArgumentNullException(nameof(httpContextProvider));
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            IEnumerable<KeyValuePair<string, string>> claims = _httpContextProvider.GetClaimValues();

            foreach (KeyValuePair<string, string> claim in claims)
            {
                if (!request.Headers.Contains(claim.Key))
                {
                    request.Headers.Add(claim.Key, claim.Value);
                }
            }

            string apiKey = _httpContextProvider.HttpContext?.Request?.Headers.Find(AthenaeumConstants.Api.ApiHeaderKey);
            if (!string.IsNullOrWhiteSpace(apiKey))
            {
                request.Headers.Add(AthenaeumConstants.Api.ApiHeaderKey, apiKey);
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}