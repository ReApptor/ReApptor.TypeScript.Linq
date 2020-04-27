using System;

namespace Renta.Components.Common.Providers
{
    public class Token : TokenInfo
    {
        public DateTime Expires { get; set; }
        
        public string Jwt { get; set; }
        
        public string Url { get; set; }
        
        public string ShortUrl { get; set; }
    }
}