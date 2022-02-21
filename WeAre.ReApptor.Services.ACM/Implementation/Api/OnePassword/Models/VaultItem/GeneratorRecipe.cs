using Newtonsoft.Json;
using WeAre.ReApptor.Services.ACM.Implementation.API.OnePassword.Models.VaultItem;

namespace WeAre.ReApptor.Services.ACM.Implementation.API.OnePassword.Models
{
    /// <summary>
    /// The recipe is used in conjunction with the “generate” property to set the character set used to generate a new secure value
    /// </summary>
    public sealed class GeneratorRecipe
    {
        /// <summary>
        /// The length of the password to generate. Optional.
        /// </summary>
        [JsonProperty("length")]
        public int Length { get; set; }
        
        [JsonProperty("characterSets")]
        public VaultItemFieldCharacterSets VaultItemFieldCharacterSets { get; set; }
    }
}