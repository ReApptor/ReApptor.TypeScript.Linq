using System.Security.Claims;

namespace Renta.Components.Common.Providers
{
    public interface ISecurityProvider
    {
        ClaimsIdentity Caller { get; }
        
        string CallerUsername { get; }
    }
}