using System.Linq;
using System.Threading.Tasks;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models;
using Xunit;

namespace WeAre.Athenaeum.Services.UnitTest.ACM
{
    public sealed class OnePasswordApiProviderTest
    {
        private OnePasswordApiSettings GetSettings()
        {
            return new OnePasswordApiSettings
            {
                ApiUrl = "https://dev-1password-api.reapptor.biz/v1/",
                AccessToken = "eyJhbGciOiJFUzI1NiIsImtpZCI6Inl5N3czNDR0aDY1d2R2bm5iNzdzeHZiam51IiwidHlwIjoiSldUIn0.eyIxcGFzc3dvcmQuY29tL2F1dWlkIjoiNVVFQkJBWE41UkZZN05CVk9FNVdYNlFRTEkiLCIxcGFzc3dvcmQuY29tL3Rva2VuIjoiRHZsWVE3TEhXbFN4QlBIVTM5TExuRTVTWG1ibFBkLW8iLCIxcGFzc3dvcmQuY29tL2Z0cyI6WyJ2YXVsdGFjY2VzcyJdLCIxcGFzc3dvcmQuY29tL3Z0cyI6W3sidSI6InV1czZ4M2dnY2Zka3lnMmI2bmhkZDZidHFxIiwiYSI6NDh9XSwiYXVkIjpbImNvbS4xcGFzc3dvcmQuY29ubmVjdCJdLCJzdWIiOiI1UVlRQlBXNTJORkEzREVRVklNT0c0NEZPVSIsImlhdCI6MTYyNDg3NzAzNywiaXNzIjoiY29tLjFwYXNzd29yZC5iNSIsImp0aSI6ImZyNGduaDJhanBrcjd2aHhrcnV3bjVoNXdlIn0.E7YKqaoHBjy6A_pakpjz8EUk1WiImgcDgeDYKf-KkRX9xyjqQIgr4GNvDEmSwwZkNiFiuwOI0i75B7ipJZHKeA",
                TimeoutInSeconds = 3
            };
        }
        
        [Fact]
        public async Task ListVaultsTest()
        {
            OnePasswordApiSettings settings = GetSettings();

            var provider = new OnePasswordApiProvider(settings);

            VaultReference[] vaults = await provider.ListVaultsAsync();
            
            Assert.NotNull(vaults);
            Assert.NotEmpty(vaults);
        }
        
        [Fact]
        public async Task FindVaultByNameAsyncTest()
        {
            OnePasswordApiSettings settings = GetSettings();

            var provider = new OnePasswordApiProvider(settings);

            VaultReference[] vaults = await provider.ListVaultsAsync();
            
            Assert.NotNull(vaults);
            Assert.NotEmpty(vaults);

            VaultReference reference = vaults.First();
            
            Assert.NotNull(reference.Id);
            Assert.NotEmpty(reference.Name);

            VaultReference vault = await provider.GetVaultAsync(reference.Id);
            
            Assert.NotNull(vault);
            Assert.Equal(reference.Id, vault.Id);
            Assert.Equal(reference.Name, vault.Name);
        }
        
        [Fact]
        public async Task ListVaultItemsTest()
        {
            OnePasswordApiSettings settings = GetSettings();

            var provider = new OnePasswordApiProvider(settings);

            VaultReference[] vaults = await provider.ListVaultsAsync();
            
            Assert.NotNull(vaults);
            Assert.NotEmpty(vaults);

            VaultReference reference = vaults.First();
            
            Assert.NotNull(reference.Id);
            Assert.NotEmpty(reference.Name);

            VaultItemReference[] items = await provider.ListVaultItemsAsync(reference.Id);
            
            Assert.NotNull(items);
            Assert.NotEmpty(items);
        }
        
        [Fact]
        public async Task GetVaultItemTest()
        {
            OnePasswordApiSettings settings = GetSettings();

            var provider = new OnePasswordApiProvider(settings);

            VaultReference[] vaults = await provider.ListVaultsAsync();
            
            Assert.NotNull(vaults);
            Assert.NotEmpty(vaults);

            VaultReference reference = vaults.First();
            
            Assert.NotNull(reference.Id);
            Assert.NotEmpty(reference.Name);

            VaultItemReference[] items = await provider.ListVaultItemsAsync(reference.Id);
            
            Assert.NotNull(items);
            Assert.NotEmpty(items);
            
            VaultItemReference itemReference = items.First();
            
            Assert.NotNull(itemReference);
            Assert.NotNull(itemReference.Id);
            Assert.NotEmpty(itemReference.Id);
            Assert.NotNull(itemReference.Vault);
            Assert.NotNull(itemReference.Vault.Id);
            Assert.NotEmpty(itemReference.Vault.Id);

            VaultItem item = await provider.GetVaultItemAsync(itemReference.Vault.Id, itemReference.Id);
            
            Assert.NotNull(item);
            Assert.NotNull(item.Fields);
            Assert.NotEmpty(item.Fields);
        }
    }
}