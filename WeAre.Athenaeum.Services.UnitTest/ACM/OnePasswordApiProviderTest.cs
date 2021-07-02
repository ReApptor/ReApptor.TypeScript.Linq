using System;
using System.Linq;
using System.Threading.Tasks;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword;
using WeAre.Athenaeum.Services.ACM.Implementation.Api.OnePassword.Models.VaultItem;
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
            var writeAccessToken = "eyJhbGciOiJFUzI1NiIsImtpZCI6Inl5N3czNDR0aDY1d2R2bm5iNzdzeHZiam51IiwidHlwIjoiSldUIn0.eyIxcGFzc3dvcmQuY29tL2F1dWlkIjoiNVVFQkJBWE41UkZZN05CVk9FNVdYNlFRTEkiLCIxcGFzc3dvcmQuY29tL2Z0cyI6WyJ2YXVsdGFjY2VzcyJdLCIxcGFzc3dvcmQuY29tL3Rva2VuIjoiRHZsWVE3TEhXbFN4QlBIVTM5TExuRTVTWG1ibFBkLW8iLCIxcGFzc3dvcmQuY29tL3Z0cyI6W3siYSI6NDk2LCJ1Ijoib3hhNGgzaHNrN3l1Nmppa3Z0bXEzcXNzYjQifV0sImF1ZCI6WyJjb20uMXBhc3N3b3JkLmNvbm5lY3QiXSwiaWF0IjoxNjI1MTI3NjE3LCJpc3MiOiJjb20uMXBhc3N3b3JkLmI1IiwianRpIjoiYXp0eXpxM3kzdTNqcHZ3a2g0a2V2am5ibm0iLCJzdWIiOiI1UVlRQlBXNTJORkEzREVRVklNT0c0NEZPVSJ9.wuE_ZG2HcH2BufQbJiMhyc9bjhqyavJYJrrDXD1cvRx_orsGZmFxn0b33sNguQvW-psF7LyLvwdGGoHP5eOrSw";
            
            return new OnePasswordApiSettings
            {
                ApiUrl = "https://dev-1password-api.reapptor.biz/v1/",
                AccessToken = needWriteAccess ? writeAccessToken : readAccessToken,
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
            Assert.NotEmpty(reference.Id);
            Assert.NotNull(reference.Name);
            Assert.NotEmpty(reference.Name);

            VaultReference vault = await provider.FindVaultByNameAsync(reference.Name);
            
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

            VaultReference fakeVault = await provider.FindVaultByNameAsync("fake");

            Assert.Null(fakeVault);
            
            VaultReference[] vaults = await provider.ListVaultsAsync();
            
            Assert.NotNull(vaults);
            Assert.NotEmpty(vaults);

            VaultReference reference = vaults.First();
            
            Assert.NotNull(reference.Id);
            Assert.NotEmpty(reference.Name);

            VaultReference existingVaultReference = await provider.FindVaultByNameAsync(reference.Name);

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
            var requestVaultItem = OnePasswordApiProviderTestData.CreateNewTestVaultItem();

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
        public async Task PatchVaultItemFieldsAsyncTest()
        {
            var requestVaultItem = OnePasswordApiProviderTestData.CreateNewTestVaultItem();

            OnePasswordApiSettings settings = GetSettings(true);

            var provider = new OnePasswordApiProvider(settings);

            VaultItem vaultItem = await provider.AddVaultItemAsync(requestVaultItem);

            Assert.NotNull(vaultItem);
            Assert.NotEmpty(vaultItem.Fields);

            var itemField = vaultItem.Fields.Last();

            var fieldId = itemField.Id;
            var fieldValue = itemField.Value;

            Assert.NotNull(fieldValue);
            Assert.NotEmpty(fieldValue);
            
            try
            {
                //Test replace patch
                string newItemFieldValue = "unitTestValue";
                VaultItemDetailsPatch[] replacePatch =
                {
                    new VaultItemDetailsPatch
                    {
                        Operation = VaultItemDetailsPatchOperation.Replace,
                        Path = $"/fields/{fieldId}/value",
                        Value = newItemFieldValue
                    }
                };

                VaultItem replacePatchVaultItem = await provider.PatchVaultItemFieldsAsync(vaultItem.Vault.Id, vaultItem.Id, replacePatch);

                Assert.NotNull(replacePatchVaultItem);
                Assert.NotNull(replacePatchVaultItem.Fields);
                Assert.NotEmpty(replacePatchVaultItem.Fields);

                VaultItemField replacePatchFieldValue = replacePatchVaultItem.Fields.SingleOrDefault(field => field.Id == fieldId);

                Assert.NotNull(replacePatchFieldValue);
                Assert.NotEqual(replacePatchFieldValue.Value, fieldValue);
                Assert.Equal(replacePatchFieldValue.Value, newItemFieldValue);

                //Test remove patch
                VaultItemDetailsPatch[] removePatch =
                {
                    new VaultItemDetailsPatch
                    {
                        Operation = VaultItemDetailsPatchOperation.Remove,
                        Path = $"/fields/{fieldId}/value",
                        Value = ""
                    }
                };

                VaultItem removePatchVaultItem = await provider.PatchVaultItemFieldsAsync(vaultItem.Vault.Id, vaultItem.Id, removePatch);

                VaultItemField removePatchFieldValue = removePatchVaultItem.Fields.SingleOrDefault(field => field.Id == fieldId);

                Assert.NotNull(removePatchFieldValue);
                Assert.Null(removePatchFieldValue.Value);

                //Test add patch

                VaultItemDetailsPatch[] addPatch =
                {
                    new VaultItemDetailsPatch
                    {
                        Operation = VaultItemDetailsPatchOperation.Add,
                        Path = $"/fields/{fieldId}/value",
                        Value = newItemFieldValue
                    }
                };

                VaultItem addPatchVaultItem = await provider.PatchVaultItemFieldsAsync(vaultItem.Vault.Id, vaultItem.Id, addPatch);

                VaultItemField addPatchFieldValue = addPatchVaultItem.Fields.SingleOrDefault(field => field.Id == fieldId);

                Assert.NotNull(addPatchFieldValue);
                Assert.NotNull(addPatchFieldValue.Value);
                Assert.Equal(newItemFieldValue, addPatchFieldValue.Value);
            }
            finally
            {
                //Clean vault 
                await provider.DeleteVaultItemAsync(vaultItem.Vault.Id, vaultItem.Id);

                var itemReference = await provider.FindSingleVaultItemReferenceByTitleAsync(vaultItem.Vault.Id, vaultItem.Title);

                Assert.Null(itemReference);
            }
        }

        [Fact]
        public async Task AddVaultItemFailsWithReadAccessTokenTest()
        {
            var requestVaultItem = OnePasswordApiProviderTestData.CreateNewTestVaultItem();

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