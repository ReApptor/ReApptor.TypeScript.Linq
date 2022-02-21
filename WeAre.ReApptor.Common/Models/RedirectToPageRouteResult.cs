using Microsoft.AspNetCore.Mvc;

namespace WeAre.ReApptor.Common.Models
{
    public sealed class RedirectToPageRouteResult : RedirectToPageResult
    {
        public RedirectToPageRouteResult(string pageName, int? index = null, string id = null, object parameters = null)
            : base(pageName, parameters)
        {
            PageRoute = new PageRoute(pageName, index, id, parameters);
        }

        public object Parameters => PageRoute.Parameters;

        public PageRoute PageRoute { get; }
    }
}