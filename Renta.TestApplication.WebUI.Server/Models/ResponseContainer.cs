using Renta.TestApplication.WebUI.Server.Models;
using WeAre.Athenaeum.TemplateApp.WebUI.Server.Models.Alert;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Models
{
    public sealed class ResponseContainer
    {
        public object Value { get; set; }

        public ApplicationContext Context { get; set; }

        public PageRoute Redirect { get; set; }

        public ServerError Error { get; set; }

        public AlertModel Alert { get; set; }

        /// <summary>
        /// Command to React to re-create application context in case of session timeout
        /// </summary>
        public bool Unauthorized { get; set; }

        public bool IsResponseContainer
        {
            get { return true; }
        }
    }
}