using System.Diagnostics;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Models
{
    [DebuggerDisplay("{Name}")]
    public class PageRoute
    {
        public string Name { get; set; }
        
        public int? Index { get; set; }
        
        public string Id { get; set; }
        
        public BasePageParameters Parameters { get; set; }
        
        public bool IsPageRoute => true;

        public PageRoute()
        {
        }

        public PageRoute(string name, int? index = null, string id = null, BasePageParameters parameters = null)
        {
            Name = name;
            Index = index;
            Id = id;
            Parameters = parameters;
        }

        public static implicit operator PageRoute(string name)
        {
            return new PageRoute { Name = name };
        }
    }
}