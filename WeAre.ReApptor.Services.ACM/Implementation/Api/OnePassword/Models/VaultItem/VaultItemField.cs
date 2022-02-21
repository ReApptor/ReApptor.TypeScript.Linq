using Newtonsoft.Json;

namespace WeAre.ReApptor.Services.ACM.Implementation.API.OnePassword.Models.VaultItem
{
    public sealed class VaultItemField
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("section")]
        public VaultItemSection Section { get; set; }
        
        [JsonProperty("type")]
        public string Type { get; set; }
        
        [JsonProperty("purpose")]
        public string Purpose { get; set; }
        
        [JsonProperty("label")]
        public string Label { get; set; }
        
        /// <summary>
        /// The value to save for the field.
        ///You can specify a generate field instead of value to create a password or other random information for the value.
        /// </summary>
        [JsonProperty("value")]
        public string Value { get; set; }
        
        /// <summary>
        /// Generate a password and save in the value for the field. By default, the password is a 32-characters long,
        /// made up of letters, numbers, and symbols. To customize the password, include a recipe field.
        /// </summary>
        [JsonProperty("generate")]
        public bool Generate { get; set; }
        
        [JsonProperty("recipe")]
        public GeneratorRecipe Recipe { get; set; }
    }
}