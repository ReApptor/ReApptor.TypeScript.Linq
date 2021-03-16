using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using WeAre.Athenaeum.Toolkit.Extensions;

namespace WeAre.Athenaeum.Common.Providers
{
    /// <summary>
    /// Specifies the current request culture based on language in HttpContext Provider (applicable for Frontend and Backend)
    /// </summary>
    public sealed class HttpContextRequestCultureProvider : RequestCultureProvider
    {
        private static async Task<ProviderCultureResult> RecognizeCultureAsync(HttpContext httpContext)
        {
            ProviderCultureResult result = null;

            var options = httpContext?.RequestServices.GetService<IOptions<RequestLocalizationOptions>>();

            if (options?.Value != null)
            {
                var httpContextProvider = httpContext.RequestServices?.GetService<HttpContextProvider>();

                if (httpContextProvider != null)
                {
                    CultureInfo culture = options.Value.SupportedCultures.FindCulture(httpContextProvider.Language);

                    if (culture != null)
                    {
                        result = new ProviderCultureResult(culture.Name);
                    }
                }
            }

            return await Task.FromResult(result);
        }
        
        public override async Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
        {
            return await RecognizeCultureAsync(httpContext);
        }

        public static RequestCulture GetCultureRequest(IList<CultureInfo> supportedCultures, string language, CultureInfo @default = null)
        {
            CultureInfo culture = supportedCultures.FindCulture(language) ?? @default;
            
            if (culture == null)
                throw new ArgumentOutOfRangeException(nameof(language), $"Language culture \"{language}\" cannot be found or recognized, default culture is not specified.");
            
            return new RequestCulture(culture);
        }

        public static readonly HttpContextRequestCultureProvider Instance = new HttpContextRequestCultureProvider();
        
        public static readonly CustomRequestCultureProvider Provider = new CustomRequestCultureProvider(RecognizeCultureAsync);
    }
}