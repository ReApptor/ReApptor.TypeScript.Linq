using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WeAre.ReApptor.Toolkit;

namespace WeAre.ReApptor.Common.Api
{
    public abstract class BaseApiProvider<TSettings> where TSettings : IApiSettings
    {
        #region Private/Protected

        private readonly TSettings _settings;
        private bool _authorizing;

        private Dictionary<string, string> GetHeaders(HttpHeaders headers)
        {
            var result = new Dictionary<string, string>();
            foreach (KeyValuePair<string, IEnumerable<string>> header in headers)
            {
                string key = header.Key;
                if ((!string.IsNullOrWhiteSpace(key)) && (headers.TryGetValues(key, out IEnumerable<string> values)) && (values != null))
                {
                    string headerValue = string.Join(";", values.Where(item => !string.IsNullOrWhiteSpace(item)).Distinct());
                    if (!string.IsNullOrWhiteSpace(headerValue))
                    {
                        if (result.ContainsKey(key))
                        {
                            result[key] = $"{result[key]};{headerValue}";
                        }
                        else
                        {
                            result.Add(key, headerValue);
                        }
                    }
                }
            }

            return result;
        }

        protected string GetHeader(Dictionary<string, string> headers, string key)
        {
            return ((headers != null) && (!string.IsNullOrWhiteSpace(key)) && (headers.ContainsKey(key)))
                ? headers[key]
                : null;
        }

        protected string GetUrl(string action, string[] keys, (string, object)[] @params)
        {
            string url = $"{_settings.ApiUrl.TrimEnd('/')}/{action.Trim('/')}";

            if ((keys != null) && (keys.Length > 0))
            {
                foreach (string key in keys)
                {
                    if (!string.IsNullOrWhiteSpace(key))
                    {
                        string[] subKeys = key.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
                        foreach (string subKey in subKeys)
                        {
                            if (!string.IsNullOrWhiteSpace(subKey))
                            {
                                url += "/" + WebUtility.UrlEncode(subKey);
                            }
                        }
                    }
                }
            }

            if ((@params != null) && (@params.Length > 0))
            {
                bool first = true;
                foreach ((string, object) param in @params)
                {
                    string paramKey = param.Item1;
                    object paramValue = param.Item2;

                    if ((!string.IsNullOrWhiteSpace(paramKey)) && (paramValue != null))
                    {
                        string value;
                        if ((paramValue.GetType().IsEnum))
                        {
                            MemberInfo memberInfo = paramValue
                                .GetType()
                                .GetMember(paramValue.ToString() ?? "")
                                .FirstOrDefault();
                            var enumMember = memberInfo?.GetCustomAttribute<EnumMemberAttribute>();
                            var jsonProperty = memberInfo?.GetCustomAttribute<JsonPropertyAttribute>();
                            value = enumMember?.Value ?? jsonProperty?.PropertyName ?? JsonConvert.ToString(paramValue);
                        }
                        else
                        {
                            value = (paramValue is bool b)
                                ? (b ? "true" : "false")
                                : (paramValue is DateTime d)
                                    ? d.ToString("O")
                                    : paramValue.ToString();
                        }

                        if (!string.IsNullOrWhiteSpace(value))
                        {
                            url += (first)
                                ? $"?{paramKey}={WebUtility.UrlEncode(value)}"
                                : $"&{paramKey}={WebUtility.UrlEncode(value)}";

                            first = false;
                        }
                    }
                }
            }

            bool addSlash = (!url.EndsWith("/")) && ((@params == null) || (@params.Length == 0)) && (keys?.LastOrDefault()?.EndsWith("/") == true);

            if (addSlash)
            {
                url += "/";
            }

            return url;
        }

        protected virtual TResponse HeadersToResponse<TResponse>(Dictionary<string, string> headers)
        {
            return default;
        }

        protected virtual HttpClient CreateHttpClient()
        {
            return new HttpClient(new HttpClientHandler());
        }

        protected string GetBasicToken(string username, string password)
        {
            return Convert.ToBase64String(Encoding.ASCII.GetBytes(username + ":" + password));
        }

        protected virtual Task AuthorizeAsync(HttpClient client)
        {
            var basicSettings = _settings as IBasicApiSettings;

            if (!string.IsNullOrWhiteSpace(basicSettings?.Username))
            {
                string credentials = GetBasicToken(basicSettings.Username, basicSettings.Password);

                client.DefaultRequestHeaders.Add("Authorization", $"Basic {credentials}");
            }

            return Task.FromResult(0);
        }

        protected virtual async Task<HttpClient> GetHttpClientAsync(string userAgent = null, string acceptEncoding = null)
        {
            HttpClient httpClient = CreateHttpClient();

            if (!string.IsNullOrWhiteSpace(userAgent))
            {
                httpClient.DefaultRequestHeaders.Add("User-Agent", userAgent);
            }

            if (string.IsNullOrWhiteSpace(acceptEncoding))
            {
                acceptEncoding = "application/json";
            }
            
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(acceptEncoding));

            if (_settings.TimeoutInSeconds > 0)
            {
                httpClient.Timeout = TimeSpan.FromSeconds(_settings.TimeoutInSeconds);
            }

            if (!_authorizing)
            {
                try
                {
                    _authorizing = true;
                    await AuthorizeAsync(httpClient);
                }
                finally
                {
                    _authorizing = false;
                }
            }

            return httpClient;
        }

        protected async Task<HttpResponseMessage> SendAsync(string url, HttpMethod method = null, HttpContent content = null, string userAgent = null, string acceptEncoding = null)
        {
            using HttpClient httpClient = await GetHttpClientAsync(userAgent, acceptEncoding);

            method ??= (content != null) ? HttpMethod.Post : HttpMethod.Get;

            if (method == HttpMethod.Get)
            {
                return await httpClient.GetAsync(url);
            }

            if (method == HttpMethod.Delete)
            {
                return await httpClient.DeleteAsync(url);
            }

            if (method == HttpMethod.Put)
            {
                return await httpClient.PutAsync(url, content);
            }

            if (method == HttpMethod.Post)
            {
                return await httpClient.PostAsync(url, content);
            }

            if (method == HttpMethod.Patch)
            {
                return await httpClient.PatchAsync(url, content);
            }

            return (content != null)
                ? await httpClient.PostAsync(url, content)
                : await httpClient.GetAsync(url);
        }

        #region Invokes

        private async Task<TResponse> InvokeAsync<TResponse>(HttpMethod method, string action, HttpContent content, string userAgent = null, string acceptEncoding = null, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true)
            where TResponse : class
        {
            string url = GetUrl(action, keys, @params);

            HttpResponseMessage httpResponse = await Utility.InvokeAsync(() => SendAsync(url, method, content, userAgent, acceptEncoding), 3);

            string jsonResponse = await httpResponse.Content.ReadAsStringAsync();

            Dictionary<string, string> headers = GetHeaders(httpResponse.Headers);

            if (!httpResponse.IsSuccessStatusCode)
            {
                if ((!throwNotFound) && (httpResponse.StatusCode == HttpStatusCode.NotFound))
                {
                    return default;
                }

                string xErrors = GetHeader(headers, "X-Application-Error-Info") ?? string.Empty;

                throw new InvalidOperationException($"{Name} api request failed. Response code = \"{httpResponse.StatusCode}\". Request url = \"{url}\". Response message = \"{jsonResponse}\". XErrors = \"{xErrors}\".");
            }

            var response = (!string.IsNullOrWhiteSpace(jsonResponse))
                ? (typeof(TResponse) == typeof(string))
                    ? jsonResponse as TResponse
                    : JsonConvert.DeserializeObject<TResponse>(jsonResponse)
                : HeadersToResponse<TResponse>(headers);

            if ((typeof(TResponse) != typeof(object)) && (response == null))
                throw new InvalidOperationException($"{Name} api request failed. Response cannot be parsed. Request url = \"{url}\". Response message = \"{jsonResponse}\".");

            return response;
        }

        protected async Task<TResponse> InvokeAsync<TRequest, TResponse>(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, bool throwNotFound = true, string contentType = null, string userAgent = null, string acceptEncoding = null)
            where TRequest : class
            where TResponse : class
        {
            StringContent content = null;

            if (request != null)
            {
                contentType ??= AthenaeumConstants.Http.ApiContextType;
                
                if (request is string stringRequest)
                {
                    content = new StringContent(stringRequest, Encoding.UTF8, AthenaeumConstants.Http.TextMimeType);
                }
                else
                {
                    string requestJson = JsonConvert.SerializeObject(request);

                    content = new StringContent(requestJson, Encoding.UTF8, contentType);
                }
                
                bool emptyEncoding = AthenaeumConstants.Http.CustomMimeTypesWithoutEncoding.Contains(contentType);

                if (emptyEncoding)
                {
                    content.Headers.ContentType.CharSet = "";
                }
            }

            return await InvokeAsync<TResponse>(method, action, content, userAgent, acceptEncoding, keys, @params, throwNotFound);
        }

        protected async Task<TResponse> InvokeAsync<TResponse>(HttpMethod method, string action, IEnumerable<KeyValuePair<string, string>> form, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TResponse : class
        {
            using var content = new FormUrlEncodedContent(form);

            return await InvokeAsync<TResponse>(method, action, content, userAgent, acceptEncoding, keys, @params, throwNotFound);
        }

        protected Task<TResponse> InvokeAsync<TRequest, TResponse>(string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TRequest : class
            where TResponse : class
        {
            return InvokeAsync<TRequest, TResponse>(null, action, keys, @params, request, throwNotFound: throwNotFound, userAgent: userAgent, acceptEncoding: acceptEncoding);
        }

        protected Task<TResponse> InvokeAsync<TResponse>(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TResponse : class
        {
            return InvokeAsync<object, TResponse>(method, action, keys, @params, throwNotFound: throwNotFound, userAgent: userAgent, acceptEncoding: acceptEncoding);
        }

        protected Task<TResponse> InvokeAsync<TResponse>(string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
            where TResponse : class
        {
            return InvokeAsync<object, TResponse>(null, action, keys, @params, throwNotFound: throwNotFound, userAgent: userAgent, acceptEncoding: acceptEncoding);
        }

        protected Task InvokeAsync(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true, string userAgent = null, string acceptEncoding = null)
        {
            return InvokeAsync<object, object>(method, action, keys, @params, throwNotFound: throwNotFound, userAgent: userAgent, acceptEncoding: acceptEncoding);
        }

        #endregion

        protected virtual string Name => GetType().Name;

        #endregion

        #region Constructors

        protected BaseApiProvider(TSettings settings)
        {
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
        }

        #endregion

        #region Public

        public TSettings Settings => _settings;

        #endregion
    }

    public abstract class BaseApiProvider : BaseApiProvider<IApiSettings>
    {
        protected BaseApiProvider(IApiSettings settings)
            : base(settings)
        {
        }
    }
}