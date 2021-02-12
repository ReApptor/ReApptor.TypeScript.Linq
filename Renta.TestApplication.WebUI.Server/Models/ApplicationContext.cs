using System;
using WeAre.Athenaeum.TemplateApp.Common;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Models
{
    public class ApplicationContext
    {
        public ApplicationContext()
        {
            Id = Guid.NewGuid();
        }

        public ApplicationContext(ApplicationContext context)
            : this()
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            Id = context.Id;
            Version = context.Version;
            Country = context.Country;
            Language = context.Language;
            XsrfToken = context.XsrfToken;
            CurrentPage = context.CurrentPage;
            ApplicationName = context.ApplicationName;
            Trace = context.Trace;
            TimezoneOffset = context.TimezoneOffset;
            Settings = context.Settings;
            IsDevelopment = context.IsDevelopment;
            ApplicationType = context.ApplicationType;
        }

        public Guid Id { get; set; }

        public string Version { get; set; }

        public string Country { get; set; }

        public string Language { get; set; }

        public string XsrfToken { get; set; }

        public PageRoute CurrentPage { get; set; }
        
        public string ApplicationName { get; set; }

        public string Trace { get; set; }

        public int TimezoneOffset { get; set; }
        
        public WebApplicationType ApplicationType { get; set; }

        public ApplicationSettings Settings { get; set; }
        
        public bool IsDevelopment { get; set; }

        public bool MobileApp => (ApplicationType == WebApplicationType.MobileApp);
        
        public bool PwaApp => (ApplicationType == WebApplicationType.PwaApp);
        
        public bool DesktopBrowser => (ApplicationType == WebApplicationType.DesktopBrowser);
        
        public bool MobileBrowser => (ApplicationType == WebApplicationType.MobileBrowser);
        
        public bool IsApplicationContext => true;
    }
}