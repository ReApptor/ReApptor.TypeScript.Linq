using Microsoft.AspNetCore.Mvc;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Models
{
    public sealed class RedirectToPageRouteResult : RedirectToPageResult
    {
        public RedirectToPageRouteResult(string pageName, int? index = null, string id = null, BasePageParameters parameters = null)
            : base(pageName, parameters)
        {
            PageRoute = new PageRoute(pageName, index, id, parameters);
        }

        public BasePageParameters Parameters
        {
            get { return PageRoute.Parameters; }
        }

        public PageRoute PageRoute { get; }
    }
}