using System;
using Newtonsoft.Json;

namespace WeAre.ReApptor.Services.ACM.Implementation.API.OnePassword.Models.VaultItemReference
{
    public sealed class VaultItemReference
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        /// <summary>
        /// The title of the item
        /// </summary>
        [JsonProperty("title")]
        public string Title { get; set; }
        
        /// <summary>
        /// An object containing an id property whose value is the UUID of the vault the item is in.
        /// </summary>
        [JsonProperty("vault")]
        public VaultId Vault { get; set; }
        
        [JsonProperty("version")]
        public string Version { get; set; }
        
        [JsonProperty("lastEditedBy")]
        public string LastEditedBy { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
        
        [JsonProperty("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}