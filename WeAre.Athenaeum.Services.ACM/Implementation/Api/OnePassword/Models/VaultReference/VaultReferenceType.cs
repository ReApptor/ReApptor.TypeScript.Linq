using System.ComponentModel;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models
{
    public enum VaultReferenceType
    {
        [Description("The team Shared vault.")]
        EVERYONE = 0,
        [Description("The Private vault for the Connect server.")]
        PERSONAL = 1,
        [Description("A vault created by a user.")]
        USER_CREATED = 2
    }
}