using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WeAre.Athenaeum.Common.Interfaces.ACM;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItem;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItemReference;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultReference;
using WeAre.Athenaeum.Services.ACM.Models;

namespace WeAre.Athenaeum.Services.ACM.Implementation
{
    public sealed class OnePasswordCredentialService : ICredentialService
    {
        private OnePasswordApiProvider _client;
        private readonly OnePasswordCredentialServiceSettings _settings;
        private readonly ILogger<OnePasswordCredentialService> _logger;
        
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

        public OnePasswordCredentialService(ILogger<OnePasswordCredentialService> logger, IOptions<OnePasswordCredentialServiceSettings> settings)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
        }

        public OnePasswordCredentialService(ILogger<OnePasswordCredentialService> logger, ICredentialServiceSettings settings)
        {
            if (settings == null)
                throw new ArgumentOutOfRangeException(nameof(settings));
            if (!(settings is OnePasswordCredentialServiceSettings onePasswordSettings))
                throw new ArgumentOutOfRangeException(nameof(settings), $"\"{typeof(OnePasswordCredentialServiceSettings).FullName}\" is expected, but settings has type \"{settings.GetType().FullName}\".");

            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settings = onePasswordSettings;
        }

        public void Initialize(ICredentialServiceSettings settings)
        {
            if (settings == null)
                throw new ArgumentOutOfRangeException(nameof(settings));
            if (!(settings is OnePasswordCredentialServiceSettings onePasswordSettings))
                throw new ArgumentOutOfRangeException(nameof(settings), $"\"{typeof(OnePasswordCredentialServiceSettings).FullName}\" is expected, but settings has type \"{settings.GetType().FullName}\".");

            _settings.ApiUrl = onePasswordSettings.ApiUrl;
            _settings.AccessToken = onePasswordSettings.AccessToken;
            _settings.Path = onePasswordSettings.Path;
            _settings.TimeoutInSeconds = onePasswordSettings.TimeoutInSeconds;
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

        public async Task<IEnumerable<ICredential>> ListCredentialsAsync(string path = "")
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                path = _settings.Path;
            }

            OnePasswordApiProvider client = GetClient();

            VaultReference[] vaults = await client.ListVaultsAsync();

            var credentials = new List<ICredential>();
            foreach (VaultReference vault in vaults)
            {
                if ((string.IsNullOrWhiteSpace(path)) || (vault.Id == path) || (vault.Name == path))
                {
                    VaultItemReference[] vaultItemsReferences = await client.ListVaultItemsAsync(vault.Id);

                    foreach (VaultItemReference vaultItemReference in vaultItemsReferences)
                    {
                        VaultItem vaultItem = await client.GetVaultItemAsync(vaultItemReference.Vault.Id, vaultItemReference.Id);

                        credentials.AddRange(vaultItem.Transform());
                    }
                }
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