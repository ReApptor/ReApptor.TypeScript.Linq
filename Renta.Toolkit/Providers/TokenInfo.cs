using System;

namespace Renta.Toolkit.Providers
{
    public class TokenInfo
    {
        public Guid Id { get; set; }
        
        public string Username { get; set; }
        
        public Guid SecurityStamp { get; set; }
        
        public TokenData Data { get; set; }
    }
}