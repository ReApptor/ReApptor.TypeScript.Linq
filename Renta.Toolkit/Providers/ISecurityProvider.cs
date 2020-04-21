using System.Security.Claims;

namespace Renta.Toolkit.Providers
{
    public interface ISecurityProvider
    {
        ClaimsIdentity Caller { get; }
        
        string CallerUsername { get; }
    }
}