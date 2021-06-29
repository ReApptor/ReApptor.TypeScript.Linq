using System.Collections.Generic;
using System.Linq;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models;
using WeAre.Athenaeum.Services.ACM.Models;

namespace WeAre.Athenaeum.Services.ACM.Implementation
{
    public static class OnePasswordTransformer
    {
        public static CredentialKey ToCredentialKey(this VaultItemField from, VaultItem item)
        {
            if (from == null)
            {
                return null;
            }
            
            var to = new CredentialKey
            {
                Label = from.Label,
                Path = $"{item.Vault?.Id}/{item.Id}"
            };

            return to;
        }
        
        public static Credential Transform(this VaultItemField from, VaultItem item)
        {
            if (from == null)
            {
                return null;
            }
            
            CredentialKey key = from.ToCredentialKey(item);

            var to = new Credential(key)
            {
                Value = from.Value
            };

            return to;
        }
        
        public static Credential[] Transform(this VaultItem from)
        {
            return from?.Fields?.Where(item => item != null).Select(item => item.Transform(from)).ToArray();
        }
        
        public static Credential[] Transform(this IEnumerable<VaultItem> from)
        {
            return from?.Where(item => item != null).SelectMany(Transform).ToArray();
        }
    }
}