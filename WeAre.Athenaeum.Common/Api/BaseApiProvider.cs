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
using WeAre.Athenaeum.Toolkit;

namespace WeAre.Athenaeum.Common.Api
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
                        string[] subKeys = key.Split(new[] {"/"}, StringSplitOptions.RemoveEmptyEntries);
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

        protected virtual async Task<HttpClient> GetHttpClientAsync()
        {
            HttpClient client = CreateHttpClient();

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            if (_settings.TimeoutInSeconds > 0)
            {
                client.Timeout = TimeSpan.FromSeconds(_settings.TimeoutInSeconds);
            }

            if (!_authorizing)
            {
                try
                {
                    _authorizing = true;
                    await AuthorizeAsync(client);
                }
                finally
                {
                    _authorizing = false;
                }
            }

            return client;
        }

        protected async Task<HttpResponseMessage> SendAsync(string url, HttpMethod method = null, StringContent content = null)
        {
            using HttpClient tkHttpClient = await GetHttpClientAsync();

            method ??= (content != null) ? HttpMethod.Post : HttpMethod.Get;

            if (method == HttpMethod.Get)
            {
                return await tkHttpClient.GetAsync(url);
            }

            if (method == HttpMethod.Delete)
            {
                return await tkHttpClient.DeleteAsync(url);
            }

            if (method == HttpMethod.Put)
            {
                return await tkHttpClient.PutAsync(url, content);
            }

            if (method == HttpMethod.Post)
            {
                return await tkHttpClient.PostAsync(url, content);
            }

            if (method == HttpMethod.Patch)
            {
                return await tkHttpClient.PatchAsync(url, content);
            }

            return (content != null)
                ? await tkHttpClient.PostAsync(url, content)
                : await tkHttpClient.GetAsync(url);
        }
        
        #region Invoks

        protected async Task<TResponse> InvokeAsync<TRequest, TResponse>(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, bool throwNotFound = true, string customContentType = null)
            where TRequest : class
            where TResponse : class
        {
            string url = GetUrl(action, keys, @params);

            StringContent content = null;

            if (request != null)
            {
                if (request is string stringRequest)
                {
                    content = new StringContent(stringRequest, Encoding.UTF8, "text/html");
                }
                else
                {
                    string requestJson = JsonConvert.SerializeObject(request);

                    //Custom content type provided as parameter to support vendor specific content types. For example: "application/vnd.api+json".
                    content = new StringContent(requestJson, Encoding.UTF8, customContentType ?? "application/json");

                    //Custom content type doesn't work with a CharSet being set.
                    if (customContentType != null)
                    {
                        content.Headers.ContentType.CharSet = string.Empty;
                    }
                }
            }

            HttpResponseMessage httpResponse = await Utility.InvokeAsync(() => SendAsync(url, method, content), 3);

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

        protected Task<TResponse> InvokeAsync<TRequest, TResponse>(string action, string[] keys = null, (string, object)[] @params = null, TRequest request = null, bool throwNotFound = true)
            where TRequest : class
            where TResponse : class
        {
            return InvokeAsync<TRequest, TResponse>(null, action, keys, @params, request, throwNotFound: throwNotFound);
        }

        protected Task<TResponse> InvokeAsync<TResponse>(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true)
            where TResponse : class
        {
            return InvokeAsync<object, TResponse>(method, action, keys, @params, throwNotFound: throwNotFound);
        }

        protected Task<TResponse> InvokeAsync<TResponse>(string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true)
            where TResponse : class
        {
            return InvokeAsync<object, TResponse>(null, action, keys, @params, throwNotFound: throwNotFound);
        }

        protected Task InvokeAsync(HttpMethod method, string action, string[] keys = null, (string, object)[] @params = null, bool throwNotFound = true)
        {
            return InvokeAsync<object, object>(method, action, keys, @params, throwNotFound: throwNotFound);
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