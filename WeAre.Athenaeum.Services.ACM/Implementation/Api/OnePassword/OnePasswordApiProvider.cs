using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using WeAre.Athenaeum.Common.Api;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItem;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultReference;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItemReference;

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
                throw new ArgumentOutOfRangeException(nameof(vaultId), "Vault Id is empty or whitespace.");

            string[] keys = {vaultId, "items"};

            return InvokeAsync<VaultItemReference[]>("/vaults/", keys, throwNotFound: false);
        }

        public Task<VaultReference> GetVaultAsync(string vaultId)
        {
            if (vaultId == null)
                throw new ArgumentNullException(nameof(vaultId));
            if (string.IsNullOrWhiteSpace(vaultId))
                throw new ArgumentOutOfRangeException(nameof(vaultId), "Vault Id is empty or whitespace.");

            string[] keys = {vaultId};

            return InvokeAsync<VaultReference>("/vaults/", keys, throwNotFound: false);
        }

        public async Task<VaultReference> FindVaultByNameAsync(string name)
        {
            VaultReference[] vaults = await FindVaultsByNameAsync(name);

            if (vaults.Length > 1)
                throw new ArgumentOutOfRangeException(nameof(name), $"Found more than one vault with name \"{name}\".");
            
            return vaults.SingleOrDefault();
        }

        public async Task<VaultReference[]> FindVaultsByNameAsync(string name)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentOutOfRangeException(nameof(name), "Vault name is empty or whitespace.");

            var @params = new (string, object)[]
            {
                //Text to search from user name, code, email or keywords
                ("filter", $"name eq \"{name}\""),
            };

            VaultReference[] vaults = await InvokeAsync<VaultReference[]>("/vaults/", @params: @params, throwNotFound: false);

            return vaults ?? new VaultReference[0];
        }

        public Task<VaultItemReference[]> FindVaultItemReferencesByTitleAsync(string vaultId, string title)
        {
            if (title == null)
                throw new ArgumentNullException(nameof(title));
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentOutOfRangeException(nameof(title), "Vault item title is empty or whitespace.");

            string[] keys = {vaultId, "items"};

            var @params = new (string, object)[]
            {
                //Text to search from user name, code, email or keywords
                ("filter", $"title eq \"{title}\""),
            };

            return InvokeAsync<VaultItemReference[]>("/vaults/", keys, @params, throwNotFound: false);
        }
        
        public async Task<VaultItemReference> FindSingleVaultItemReferenceByTitleAsync(string vaultId, string title)
        {
            VaultItemReference[] vaultItems = await FindVaultItemReferencesByTitleAsync(vaultId, title);
            
            if (vaultItems.Length > 1)
                throw new InvalidOperationException($"Found more than one vault by name {title}");

            return vaultItems.SingleOrDefault();
        }

        public Task<VaultItem> GetVaultItemAsync(string vaultId, string itemId)
        {
            if (vaultId == null)
                throw new ArgumentNullException(nameof(vaultId));
            if (string.IsNullOrWhiteSpace(vaultId))
                throw new ArgumentOutOfRangeException(nameof(vaultId), "Vault Id is empty or whitespace.");
            if (itemId == null)
                throw new ArgumentNullException(nameof(itemId));
            if (string.IsNullOrWhiteSpace(itemId))
                throw new ArgumentOutOfRangeException(nameof(itemId), "Item Id is empty or whitespace.");

            string[] keys = {vaultId, "items", itemId};

            return InvokeAsync<VaultItem>("/vaults/", keys, throwNotFound: true);
        }

        public Task<VaultItem> AddVaultItemAsync(VaultItem item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));
            if (string.IsNullOrWhiteSpace(item.Vault?.Id))
                throw new ArgumentOutOfRangeException(nameof(item), "Vault Id is empty or whitespace.");

            item.Validate();
            
            string[] keys = {item.Vault.Id, "items"};

            return InvokeAsync<VaultItem, VaultItem>("/vaults/", keys, request: item);
        }

        public Task DeleteVaultItemAsync(string vaultId, string itemId)
        {
            if (vaultId == null)
                throw new ArgumentNullException(nameof(vaultId));
            if (string.IsNullOrWhiteSpace(vaultId))
                throw new ArgumentOutOfRangeException(nameof(vaultId), "Vault Id is empty or whitespace.");
            if (itemId == null)
                throw new ArgumentNullException(nameof(itemId));
            if (string.IsNullOrWhiteSpace(itemId))
                throw new ArgumentOutOfRangeException(nameof(itemId), "Item Id is empty or whitespace.");

            string[] keys = {vaultId, "items", itemId};

            return InvokeAsync(HttpMethod.Delete, "/vaults/", keys, throwNotFound: false);
        }
    }
}