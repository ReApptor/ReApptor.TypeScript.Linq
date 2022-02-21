using System.Net.Http;
using System.Threading.Tasks;
using WeAre.ReApptor.Common.Api.Internal;

namespace WeAre.ReApptor.Common.Helpers
{
    public static class ApiHelper
    {
        public static Task<TResponse> InvokeAsync<TRequest, TResponse>(string url, HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, string contentType = null, bool throwNotFound = true)
            where TRequest : class
            where TResponse : class
        {
            var provider = new ApiProvider(new ApiSettings(url));
            return provider.InvokeAsync<TRequest, TResponse>(method, action, keys, @params, request, contentType, throwNotFound);
        }

        public static Task<TResponse> InvokeAsync<TRequest, TResponse>(string url, string action, TRequest request = null, bool throwNotFound = true)
            where TRequest : class
            where TResponse : class
        {
            return InvokeAsync<TRequest, TResponse>(url, action, null, null, request, throwNotFound);
        }

        public static Task<TResponse> InvokeAsync<TRequest, TResponse>(string url, string action, string[] keys = null, TRequest request = null, bool throwNotFound = true)
            where TRequest : class
            where TResponse : class
        {
            return InvokeAsync<TRequest, TResponse>(url, action, keys, null, request, throwNotFound);
        }

        public static Task<TResponse> InvokeAsync<TRequest, TResponse>(string url, string action, (string, object)[] @params = null, TRequest request = null, bool throwNotFound = true)
            where TRequest : class
            where TResponse : class
        {
            return InvokeAsync<TRequest, TResponse>(url, action, null, @params, request, throwNotFound);
        }

        public static Task<TResponse> InvokeAsync<TRequest, TResponse>(string url, string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, bool throwNotFound = true)
            where TRequest : class
            where TResponse : class
        {
            var provider = new ApiProvider(new ApiSettings(url));
            return provider.InvokeAsync<TRequest, TResponse>(action, keys, @params, request, throwNotFound);
        }

        public static Task<TResponse> InvokeAsync<TResponse>(string url, HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true)
            where TResponse : class
        {
            var provider = new ApiProvider(new ApiSettings(url));
            return provider.InvokeAsync<TResponse>(method, action, keys, @params, throwNotFound);
        }

        public static Task<TResponse> InvokeAsync<TResponse>(string url, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true)
            where TResponse : class
        {
            var provider = new ApiProvider(new ApiSettings(url));
            return provider.InvokeAsync<TResponse>(action, keys, @params, throwNotFound);
        }

        public static Task InvokeAsync(string url, HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true)
        {
            var provider = new ApiProvider(new ApiSettings(url));
            return provider.InvokeAsync(method, action, keys, @params, throwNotFound);
        }
    }
}