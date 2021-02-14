using System;
using WeAre.Athenaeum.TemplateApp.Common.Configuration;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Models
{
    public sealed class ApplicationSettings
    {
        #region Constructors
        
        public ApplicationSettings()
        {
        }

        public ApplicationSettings(TestApplicationConfiguration configuration)
        {
            if (configuration == null)
                throw new ArgumentNullException(nameof(configuration));

            GoogleMapApiUrl = configuration.GoogleSettings.MapApiUrl;
            GoogleMapApiKey = configuration.GoogleSettings.MapApiFeKey;
        }
        
        #endregion
        
        #region Properties
        
        public string GoogleMapApiKey { get; set; }

        public string GoogleMapApiUrl { get; set; }

        public bool IsApplicationSettings => true;

        #endregion
    }
}