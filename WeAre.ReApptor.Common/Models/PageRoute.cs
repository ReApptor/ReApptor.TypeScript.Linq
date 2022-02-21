using System.Diagnostics;

namespace WeAre.ReApptor.Common.Models
{
    [DebuggerDisplay("{Name}")]
    public class PageRoute
    {
        public string Name { get; set; }
        
        public int? Index { get; set; }
        
        public string Id { get; set; }
        
        public object Parameters { get; set; }
        
        public bool IsPageRoute => true;

        public PageRoute()
        {
        }

        public PageRoute(string name, int? index = null, string id = null, object parameters = null)
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