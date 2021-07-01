using System;
using System.Linq;
using System.Threading.Tasks;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItem;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItemReference;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultReference;
using Xunit;

namespace WeAre.Athenaeum.Services.UnitTest.ACM
{
    public sealed class OnePasswordApiProviderTest
    {
        private OnePasswordApiSettings GetSettings(bool needWriteAccess = false)
        {
            var readAccessToken = "eyJhbGciOiJFUzI1NiIsImtpZCI6Inl5N3czNDR0aDY1d2R2bm5iNzdzeHZiam51IiwidHlwIjoiSldUIn0.eyIxcGFzc3dvcmQuY29tL2F1dWlkIjoiNVVFQkJBWE41UkZZN05CVk9FNVdYNlFRTEkiLCIxcGFzc3dvcmQuY29tL2Z0cyI6WyJ2YXVsdGFjY2VzcyJdLCIxcGFzc3dvcmQuY29tL3Rva2VuIjoiRHZsWVE3TEhXbFN4QlBIVTM5TExuRTVTWG1ibFBkLW8iLCIxcGFzc3dvcmQuY29tL3Z0cyI6W3siYSI6NDgsInUiOiJveGE0aDNoc2s3eXU2amlrdnRtcTNxc3NiNCJ9XSwiYXVkIjpbImNvbS4xcGFzc3dvcmQuY29ubmVjdCJdLCJpYXQiOjE2MjUxMjc2MTUsImlzcyI6ImNvbS4xcGFzc3dvcmQuYjUiLCJqdGkiOiJ1ZHBqN3Fta2NybGV5bzQ2ZHFzdDRuc2N5dSIsInN1YiI6IjVRWVFCUFc1Mk5GQTNERVFWSU1PRzQ0Rk9VIn0.PdozB_biSF--2e4GeDcPvF6QXYsv85FX8p-G1q4O0NKyjQaqcwVfQKtk2AHwVTv1DI4GOtuJvRvrBr4DPfT-pg";
            var writeAссessToken = "eyJhbGciOiJFUzI1NiIsImtpZCI6Inl5N3czNDR0aDY1d2R2bm5iNzdzeHZiam51IiwidHlwIjoiSldUIn0.eyIxcGFzc3dvcmQuY29tL2F1dWlkIjoiNVVFQkJBWE41UkZZN05CVk9FNVdYNlFRTEkiLCIxcGFzc3dvcmQuY29tL2Z0cyI6WyJ2YXVsdGFjY2VzcyJdLCIxcGFzc3dvcmQuY29tL3Rva2VuIjoiRHZsWVE3TEhXbFN4QlBIVTM5TExuRTVTWG1ibFBkLW8iLCIxcGFzc3dvcmQuY29tL3Z0cyI6W3siYSI6NDk2LCJ1Ijoib3hhNGgzaHNrN3l1Nmppa3Z0bXEzcXNzYjQifV0sImF1ZCI6WyJjb20uMXBhc3N3b3JkLmNvbm5lY3QiXSwiaWF0IjoxNjI1MTI3NjE3LCJpc3MiOiJjb20uMXBhc3N3b3JkLmI1IiwianRpIjoiYXp0eXpxM3kzdTNqcHZ3a2g0a2V2am5ibm0iLCJzdWIiOiI1UVlRQlBXNTJORkEzREVRVklNT0c0NEZPVSJ9.wuE_ZG2HcH2BufQbJiMhyc9bjhqyavJYJrrDXD1cvRx_orsGZmFxn0b33sNguQvW-psF7LyLvwdGGoHP5eOrSw";
            
            return new OnePasswordApiSettings
            {
                ApiUrl = "https://dev-1password-api.reapptor.biz/v1/",
                AccessToken = needWriteAccess ? writeAссessToken : readAccessToken,
                TimeoutInSeconds = 3
            };
        }
        
        [Fact]
        public async Task ListVaultsAsyncTest()
        {
            OnePasswordApiSettings settings = GetSettings();

            var provider = new OnePasswordApiProvider(settings);

            VaultReference[] vaults = await provider.ListVaultsAsync();
            
            Assert.NotNull(vaults);
            Assert.NotEmpty(vaults);
        }
        
        [Fact]
        public async Task GetVaultReferenceAsyncTest()
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
        public async Task ListVaultItemsAsynTest()
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
        
        [Fact]
        public async Task FindVaultReferenceByNameTest()
        {
            OnePasswordApiSettings settings = GetSettings();
            
            var provider = new OnePasswordApiProvider(settings);

            VaultReference fakeVault = await provider.FindSingleVaultByNameAsync("fake");

            Assert.Null(fakeVault);
            
            VaultReference[] vaults = await provider.ListVaultsAsync();
            
            Assert.NotNull(vaults);
            Assert.NotEmpty(vaults);

            VaultReference reference = vaults.First();
            
            Assert.NotNull(reference.Id);
            Assert.NotEmpty(reference.Name);

            VaultReference existingVaultReference = await provider.FindSingleVaultByNameAsync(reference.Name);

            Assert.NotNull(existingVaultReference);
            Assert.Equal(reference.Name, existingVaultReference.Name);
        }
        
        [Fact]
        public async Task FindVaultItemReferencesByTitleTest()
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
            Assert.NotNull(itemReference.Title);
            Assert.NotEmpty(itemReference.Title);

            VaultItemReference[] foundItemReference = await provider.FindVaultItemReferencesByTitleAsync(reference.Id, itemReference.Title);
            
            Assert.NotNull(foundItemReference);
            Assert.NotEmpty(foundItemReference);
        }
        
        [Fact]
        public async Task AddDeleteVaultItemSuccessTest()
        {
            var requestVaultItem = OnePasswordApiProviderTestData.GetTestVaultItem();

            OnePasswordApiSettings settings = GetSettings(true);
            
            var provider = new OnePasswordApiProvider(settings);

            VaultItem vaultItem = await provider.AddVaultItemAsync(requestVaultItem);
            
            VaultItemReference itemReference = await provider.FindSingleVaultItemReferenceByTitleAsync(vaultItem.Vault.Id, vaultItem.Title);

            Assert.NotNull(itemReference);

            Assert.NotNull(vaultItem);
            Assert.Equal(vaultItem.Title, requestVaultItem.Title);
            Assert.Equal(vaultItem.Vault.Id, requestVaultItem.Vault.Id);
            Assert.Equal(vaultItem.Category, requestVaultItem.Category);
            Assert.Equal(vaultItem.Favorite, requestVaultItem.Favorite);
            Assert.Equal(vaultItem.Fields.Length, requestVaultItem.Fields.Length);
            Assert.Equal(vaultItem.Sections.Length, requestVaultItem.Sections.Length);
            
            await provider.DeleteVaultItemAsync(vaultItem.Vault.Id, vaultItem.Id);
            
            itemReference = await provider.FindSingleVaultItemReferenceByTitleAsync(vaultItem.Vault.Id, vaultItem.Title);

            Assert.Null(itemReference);
        }
        
        [Fact]
        public async Task AddVaultItemFailsWithReadAccessTokenTest()
        {
            var requestVaultItem = OnePasswordApiProviderTestData.GetTestVaultItem();

            OnePasswordApiSettings settings = GetSettings();
            
            var provider = new OnePasswordApiProvider(settings);

            try
            {
                await provider.AddVaultItemAsync(requestVaultItem);
            }
            catch (Exception ex)
            {
                Assert.Contains("token does not have permission to perform create on vault", ex.Message);
            }
        }
        
        [Fact]
        public async Task DeleteNonExistingVaultItemFailsTest()
        {
            OnePasswordApiSettings settings = GetSettings();

            var provider = new OnePasswordApiProvider(settings);

            try
            {
                await provider.DeleteVaultItemAsync("fake", "fake");
            }
            catch (Exception ex)
            {
                Assert.Contains("Authorization: token does not have access to vault fake", ex.Message);
            }
        }
    }
}