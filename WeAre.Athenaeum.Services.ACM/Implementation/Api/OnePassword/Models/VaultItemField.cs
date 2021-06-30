using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models
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
        
        [JsonProperty("value")]
        public string Value { get; set; }
    }
}