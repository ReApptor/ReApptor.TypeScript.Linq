
using Microsoft.Extensions.Options;

namespace WeAre.Athenaeum.Common.Interfaces.ACM
{
    public interface ICredentialServiceSettings<out TOptions> : IOptions<TOptions> where TOptions : class, new()
    {
    }
}