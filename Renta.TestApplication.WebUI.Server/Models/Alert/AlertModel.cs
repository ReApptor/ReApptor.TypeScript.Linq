using WeAre.Athenaeum.TemplateApp.WebUI.Server.Models.Alert;

namespace Renta.TestApplication.WebUI.Server.Models.Alert
{
    public sealed class AlertModel
    {
        public string Message { get; set; }
        
        public string[] MessageParams { get; set; }

        public AlertType AlertType { get; set; }

        public bool Dismissible { get; set; } = true;

        public bool AutoClose { get; set; }

        public int AutoCloseDelay { get; set; } = 5000;

        public bool Flyout { get; set; } = false;

        public AlertModel()
        {
        }

        public AlertModel(string message, bool dismissible = true)
        {
            Message = message;
            Dismissible = dismissible;
        }

        public AlertModel(string message, AlertType alertType, bool dismissible = true, params string[] messageParams)
        {
            Message = message;
            MessageParams = messageParams;
            AlertType = alertType;
            Dismissible = dismissible;
        }
        
        public AlertModel(string message, AlertType alertType, bool autoClose, bool dismissible, params string[] messageParams)
        {
            Message = message;
            MessageParams = messageParams;
            AlertType = alertType;
            Dismissible = dismissible;
            AutoClose = autoClose;
        }

        public static AlertModel Warning(string message, bool dismissible = true, params string[] messageParams)
        {
            return new AlertModel(message, AlertType.Warning, dismissible, messageParams);
        }

        public static AlertModel Info(string message, bool dismissible = true, params string[] messageParams)
        {
            return new AlertModel(message, AlertType.Info, dismissible, messageParams);
        }

        public static AlertModel Info(string message, params string[] messageParams)
        {
            return new AlertModel(message, AlertType.Info, messageParams: messageParams);
        }

        public static AlertModel Error(string message, bool dismissible = true, params string[] messageParams)
        {
            return new AlertModel(message, AlertType.Danger, dismissible, messageParams);
        }

        public static implicit operator AlertModel(string message)
        {
            return new AlertModel(message);
        }
    }
}