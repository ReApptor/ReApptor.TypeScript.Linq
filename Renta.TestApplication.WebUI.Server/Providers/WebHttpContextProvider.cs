using System;
using System.Globalization;
using WeAre.Athenaeum.Common;
using WeAre.Athenaeum.Common.Extensions;
using WeAre.Athenaeum.Common.Providers;
using WeAre.Athenaeum.TemplateApp.WebUI.Server.Extensions;
using WeAre.Athenaeum.TemplateApp.WebUI.Server.Models;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Providers
{
    public sealed class WebHttpContextProvider : HttpContextProvider
    {
        private string GetLanguage()
        {
            CultureInfo culture = HttpContext.RecognizeCulture();
            return culture.TwoLetterISOLanguageName;
        }

        private string GetCountry()
        {
            CultureInfo culture = HttpContext.RecognizeCountry();
            return culture.TwoLetterISOLanguageName;
        }

        protected override string FindClaim(string claimType)
        {
            if (HttpContext != null)
            {
                switch (claimType)
                {
                    case AthenaeumConstants.ClaimTypes.BrowserId:
                        return HttpContext.BrowserId();

                    case AthenaeumConstants.ClaimTypes.UserAgent:
                        return HttpContext.UserAgent();

                    case AthenaeumConstants.ClaimTypes.SessionId:
                        return HttpContext.SessionId();

                    case AthenaeumConstants.ClaimTypes.Language:
                        return ApplicationContext?.Language ?? GetLanguage();

                    case AthenaeumConstants.ClaimTypes.Country:
                        return ApplicationContext?.Country ?? GetCountry();

                    // case AthenaeumConstants.ClaimTypes.Email:
                    //     return UserContext?.Email;
                    //
                    // case AthenaeumConstants.ClaimTypes.SecurityStamp:
                    //     return UserContext?.SecurityStamp;
                    //
                    // case AthenaeumConstants.ClaimTypes.NameIdentifier:
                    //     return UserContext?.Username;
                    //
                    // case AthenaeumConstants.ClaimTypes.Phone:
                    //     return UserContext?.Phone;
                }
            }

            return null;
        }

        public WebHttpContextProvider(IServiceProvider serviceProvider)
            : base(serviceProvider)
        {
        }

        public ApplicationContext ApplicationContext
        {
            get { return (HttpContext.SessionAvailable()) ? HttpContext.Session.GetContext() : null; }
        }

        public UserContext UserContext
        {
            get { return (ApplicationContext as UserContext); }
        }
    }
}