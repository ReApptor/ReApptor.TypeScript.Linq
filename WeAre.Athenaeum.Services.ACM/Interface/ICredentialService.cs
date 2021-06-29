using System.Collections.Generic;
using System.Threading.Tasks;

namespace WeAre.Athenaeum.Services.ACM.Interface
{
    public interface ICredentialService
    {
        Task<ICredential> GetCredentialAsync(ICredentialKey key);

        Task<IEnumerable<ICredential>> ListCredentialsAsync(string path);

        Task<IEnumerable<ICredential>> ListCredentialsAsync(IEnumerable<ICredentialKey> keys);

        Task SaveCredentialAsync(ICredential credential);

        Task RemoveCredentialAsync(ICredentialKey key);
    }
}