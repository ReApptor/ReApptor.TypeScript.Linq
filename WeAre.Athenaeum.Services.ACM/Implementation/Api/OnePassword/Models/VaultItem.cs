using System;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models
{
    public sealed class VaultItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("title")]
        public string Title { get; set; }
        
        [JsonProperty("version")]
        public int Version { get; set; }
        
        [JsonProperty("vault")]
        public VaultId Vault { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }
        
        [JsonProperty("sections")]
        public VaultItemSection[] Sections { get; set; }

        [JsonProperty("fields")]
        public VaultItemField[] Fields { get; set; }
        
        [JsonProperty("lastEditedBy")]
        public DateTime LastEditedBy{ get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt{ get; set; }
        
        [JsonProperty("updatedAt")]
        public DateTime UpdatedAt{ get; set; }
    }
}