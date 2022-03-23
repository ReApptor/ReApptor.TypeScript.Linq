using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Newtonsoft.Json;
using WeAre.ReApptor.Toolkit;

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
        
        private static bool IsEqual(object x, object y)
        {
            if (ReferenceEquals(x, y))
            {
                return true;
            }
            
            if ((ReferenceEquals(x, null) || (ReferenceEquals(y, null))))
            {
                return false;
            }
            
            return (JsonConvert.SerializeObject(x) == JsonConvert.SerializeObject(y));
        }

        public static bool IsEqual(PageRoute x, PageRoute y)
        {
            if (ReferenceEquals(x, y))
            {
                return true;
            }

            if (ReferenceEquals(x, null) || ReferenceEquals(y, null))
            {
                return false;
            }

            bool equals = (x.Index == y.Index);

            equals &= Utility.IsEqual(x.Name, y.Name);

            equals &= Utility.IsEqual(x.Id, y.Id, StringComparison.InvariantCulture);

            equals &= (
                ((ReferenceEquals(x.Parameters, y.Parameters))) ||
                ((!ReferenceEquals(x.Parameters, null)) && (!ReferenceEquals(y.Parameters, null)) && (JsonConvert.SerializeObject(x) == JsonConvert.SerializeObject(y)))
            );

            return equals;
        }
    }
}