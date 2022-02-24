using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace WeAre.ReApptor.Common.Api.Internal
{
    internal class ApiProvider : BaseApiProvider
    {
        #region Constructors
        
        internal ApiProvider(ApiSettings settings)
            : base(settings)
        {
        }

        internal ApiProvider(string apiUrl, int timeoutInSeconds = 0)
            : base(new ApiSettings(apiUrl, timeoutInSeconds))
        {
        }
        
        #endregion
                
        #region Invokes

        public Task<TResponse> InvokeAsync<TRequest, TResponse>(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, string contentType = null, bool throwNotFound = true)
            where TRequest : class
            where TResponse : class
        {
            return base.InvokeAsync<TRequest, TResponse>(method, action, keys, @params, request, throwNotFound, contentType);
        }

        public new Task<TResponse> InvokeAsync<TRequest, TResponse>(string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TRequest : class
            where TResponse : class
        {
            return base.InvokeAsync<TRequest, TResponse>(action, keys, @params, request, throwNotFound, userAgent, acceptEncoding);
        }

        public new Task<TResponse> InvokeAsync<TResponse>(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TResponse : class
        {
            return base.InvokeAsync<TResponse>(method, action, keys, @params, throwNotFound, userAgent, acceptEncoding);
        }
        
        public new Task<TResponse> InvokeAsync<TResponse>(HttpMethod method, string action, IEnumerable<KeyValuePair<string, string>> form, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TResponse : class
        {
            return base.InvokeAsync<TResponse>(method, action, form, keys, @params, throwNotFound, userAgent, acceptEncoding);
        }

        public new Task<TResponse> InvokeAsync<TResponse>(string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TResponse : class
        {
            return base.InvokeAsync<TResponse>(action, keys, @params, throwNotFound, userAgent, acceptEncoding);
        }

        public new Task InvokeAsync(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
        {
            return base.InvokeAsync(method, action, keys, @params, throwNotFound, userAgent, acceptEncoding);
        }
        
        #endregion
    }
}