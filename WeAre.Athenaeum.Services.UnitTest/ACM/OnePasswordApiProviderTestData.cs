using System;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models;
using WeAre.Athenaeum.Services.ACM.Implementation.Api.OnePassword.Models.VaultItem;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItem;
using WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItemReference;

namespace WeAre.Athenaeum.Services.UnitTest.ACM
{
    public static class OnePasswordApiProviderTestData
    {
        public static readonly string UnitTestVaultName = "acm-unit-tests";
        
        private static readonly string _acmUnitTestVaultReferenceId = "oxa4h3hsk7yu6jikvtmq3qssb4";
        public static VaultItem CreateNewTestVaultItem()
        {
            return new VaultItem
            {
                Title = "Unit Test Vault Item",
                Tags = new []{"connect", "\ud83d\udc27"},
                Vault = new VaultId(_acmUnitTestVaultReferenceId),
                Category = VaultItemCategory.LOGIN.ToString(),
                Sections = new [] {new VaultItemSection {Id = "95cdbc3b-7742-47ec-9056-44d6af82d562", Label = "Security Questions"}},
                Fields = new []
                {
                    new VaultItemField
                    {
                        Id = "username",
                        Type = VaultItemFieldType.STRING.ToString(),
                        Purpose = VaultItemPurpose.USERNAME.ToString(),
                        Label = "username",
                        Value = "wendy"
                    },
                    new VaultItemField
                    {
                        Id = "password",
                        Type = VaultItemFieldType.CONCEALED.ToString(),
                        Purpose = VaultItemPurpose.PASSWORD.ToString(),
                        Label = "password",
                        Value = "wendy"
                    },
                    new VaultItemField
                    {
                        Id = "notesPlain",
                        Type = VaultItemFieldType.STRING.ToString(),
                        Purpose = VaultItemPurpose.NOTES.ToString(),
                        Label = "notesPlain",
                    },
                    new VaultItemField
                    {
                        Id = "a6cvmeqakbxoflkgmor4haji7y",
                        Type = VaultItemFieldType.URL.ToString(),
                        Label = "Example",
                        Value = "https://example.com"
                    },
                    new VaultItemField
                    {
                        Id = "boot3vsxwhuht6g7cmcx4m6rcm",
                        Section = new VaultItemSection{ Id = "95cdbc3b-7742-47ec-9056-44d6af82d562"},
                        Type = VaultItemFieldType.CONCEALED.ToString(),
                        Label = "Recovery Key",
                        Value = "s=^J@GhHP_isYP>LCq?vv8u7T:*wBP.c"
                    },
                    new VaultItemField
                    {
                        Id = "axwtgyjrvwfp5ij7mtkw2zvijy",
                        Section = new VaultItemSection{ Id = "95cdbc3b-7742-47ec-9056-44d6af82d562"},
                        Type = VaultItemFieldType.STRING.ToString(),
                        Label = "Random Text",
                        Value = "R)D~KZdV!8?51QoCibDUse7=n@wKR_}]"
                    },
                },
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
        }
    }
}