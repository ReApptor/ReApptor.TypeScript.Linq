using System;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models
{
    public sealed class VaultReference
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("attributeVersion")]
        public int AttributeVersion { get; set; }
        
        [JsonProperty("contentVersion")]
        public int ContentVersion { get; set; }
        
        [JsonProperty("items")]
        public int Items { get; set; }
        
        [JsonProperty("type")]
        public string Type { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
        
        [JsonProperty("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}