using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using WeAre.Athenaeum.Services.ACM.Interface;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models;
using WeAre.Athenaeum.Services.ACM.Models;

namespace WeAre.Athenaeum.Services.ACM.Implementation
{
    public sealed class OnePasswordCredentialService : ICredentialService
    {
        private OnePasswordApiProvider _client;
        private readonly ILogger<OnePasswordCredentialService> _logger;
        private readonly OnePasswordCredentialServiceSettings _settings;
        
        private OnePasswordApiProvider GetClient()
        {
            if (_client == null)
            {
                var settings = new OnePasswordApiSettings
                {
                    ApiUrl = _settings.ApiUrl,
                    AccessToken = _settings.AccessToken,
                    TimeoutInSeconds = _settings.TimeoutInSeconds
                };

                _client = new OnePasswordApiProvider(settings);
            }
            
            return _client;
        }
        
        public OnePasswordCredentialService(ILogger<OnePasswordCredentialService> logger, OnePasswordCredentialServiceSettings settings)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
        }

        public async Task<ICredential> GetCredentialAsync(ICredentialKey key)
        {
            if (key == null)
                throw new ArgumentNullException(nameof(key));
            if (string.IsNullOrWhiteSpace(key.Label))
                throw new ArgumentOutOfRangeException(nameof(key), "Label is empty or whitespace.");
            if (string.IsNullOrWhiteSpace(key.Path))
                throw new ArgumentOutOfRangeException(nameof(key), "Path is empty or whitespace.");

            OnePasswordApiProvider client = GetClient();

            VaultItem vaultItem = await client.GetVaultItemAsync(key.Path, key.Label);

            Credential[] credentials = vaultItem.Transform();

            Credential credential = credentials.FirstOrDefault(item => item.IsKeyMatch(key));

            if (credential == null)
                throw new ArgumentOutOfRangeException(nameof(key), $"Credential with key \"{key.Path}/{key.Label}\" not found.");

            return credential;
        }

        public async Task<IEnumerable<ICredential>> ListCredentialsAsync(string path)
        {
            if (path == null)
                throw new ArgumentNullException(nameof(path));
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentOutOfRangeException(nameof(path), "Path is empty or whitespace.");

            OnePasswordApiProvider client = GetClient();
            
            VaultItemReference[] vaultItemsReferences = await client.ListVaultItemsAsync(path);

            var credentials = new List<ICredential>();
            foreach (VaultItemReference vaultItemReference in vaultItemsReferences)
            {
                VaultItem vaultItem = await client.GetVaultItemAsync(vaultItemReference.Vault.Id, vaultItemReference.Id);
                
                credentials.AddRange(vaultItem.Transform());
            }

            return credentials;
        }

        public async Task<IEnumerable<ICredential>> ListCredentialsAsync(IEnumerable<ICredentialKey> keys)
        {
            var credentials = new List<ICredential>();
            foreach (ICredentialKey key in keys)
            {
                ICredential credential = await GetCredentialAsync(key);
                
                credentials.Add(credential);
            }

            return credentials;
        }

        public Task SaveCredentialAsync(ICredential credential)
        {
            throw new NotImplementedException();
        }

        public Task RemoveCredentialAsync(ICredentialKey key)
        {
            throw new NotImplementedException();
        }
    }
}