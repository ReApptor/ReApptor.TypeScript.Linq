using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using WeAre.Athenaeum.Common.Api;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models;
using WeAre.Athenaeum.Services.ACM.Models.OnePassword;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword
{
    public class OnePasswordApiProvider : BaseApiProvider
    {
        private readonly OnePasswordApiSettings _settings;
        
        protected override Task AuthorizeAsync(HttpClient client)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _settings.AccessToken);

            return Task.FromResult(0);
        }

        public OnePasswordApiProvider(OnePasswordApiSettings settings) 
            : base(settings)
        {
            _settings = settings;
        }

        public Task<VaultReference[]> ListVaultsAsync()
        {
            return InvokeAsync<VaultReference[]>("/vaults/", throwNotFound: false);
        }

        public Task<VaultItemReference[]> ListVaultItemsAsync(string vaultId)
        {
            if (vaultId == null)
                throw new ArgumentNullException(nameof(vaultId));
            if (string.IsNullOrWhiteSpace(vaultId))
                throw new ArgumentOutOfRangeException(nameof(vaultId), "VaultId is empty or whitespace.");
            
            string[] keys = { vaultId, "items" };
            
            return InvokeAsync<VaultItemReference[]>("/vaults/", keys, throwNotFound: false);
        }

        public Task<VaultReference> GetVaultAsync(string vaultId)
        {
            if (vaultId == null)
                throw new ArgumentNullException(nameof(vaultId));
            if (string.IsNullOrWhiteSpace(vaultId))
                throw new ArgumentOutOfRangeException(nameof(vaultId), "VaultId is empty or whitespace.");
            
            string[] keys = { vaultId };
            
            return InvokeAsync<VaultReference>("/vaults/", keys, throwNotFound: false);
        }

        public Task<VaultReference> FindVaultByNameAsync(string name)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentOutOfRangeException(nameof(name), "Vault name is empty or whitespace.");
            
            var @params = new (string, object)[]
            {
                //Text to search from user name, code, email or keywords
                ("filter", $"name eq {name}"),
            };

            return InvokeAsync<VaultReference>("/vaults/", @params: @params, throwNotFound: false);
        }
        
        public Task<VaultItem> GetVaultItemAsync(string vaultId, string itemId)
        {
            if (vaultId == null)
                throw new ArgumentNullException(nameof(vaultId));
            if (string.IsNullOrWhiteSpace(vaultId))
                throw new ArgumentOutOfRangeException(nameof(vaultId), "VaultId is empty or whitespace.");
            if (itemId == null)
                throw new ArgumentNullException(nameof(itemId));
            if (string.IsNullOrWhiteSpace(itemId))
                throw new ArgumentOutOfRangeException(nameof(itemId), "ItemId is empty or whitespace.");
            
            string[] keys = { vaultId, "items", itemId };
            
            return InvokeAsync<VaultItem>("/vaults/", keys, throwNotFound: false);
        }

        public Task<VaultItem> AddVaultItemAsync(VaultItem item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));
            if (string.IsNullOrWhiteSpace(item.Vault?.Id))
                throw new ArgumentOutOfRangeException(nameof(item), "Vault Id is empty or whitespace.");

            string[] keys = { item.Vault.Id, "items" };
            
            return InvokeAsync<VaultItem, VaultItem>("/vaults/", keys, request: item);
        }
        
        public Task DeleteVaultItemAsync(string vaultId, string itemId)
        {
            if (vaultId == null)
                throw new ArgumentNullException(nameof(vaultId));
            if (string.IsNullOrWhiteSpace(vaultId))
                throw new ArgumentOutOfRangeException(nameof(vaultId), "VaultId is empty or whitespace.");
            if (itemId == null)
                throw new ArgumentNullException(nameof(itemId));
            if (string.IsNullOrWhiteSpace(itemId))
                throw new ArgumentOutOfRangeException(nameof(itemId), "ItemId is empty or whitespace.");
            
            string[] keys = { vaultId, "items", itemId };
            
            return InvokeAsync(HttpMethod.Delete, "/vaults/", keys, throwNotFound: false);
        }
    }
}