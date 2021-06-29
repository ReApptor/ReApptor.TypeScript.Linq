using System.Collections.Generic;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models
{
    public sealed class VaultItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("title")]
        public string Title { get; set; }
        
        [JsonProperty("category")]
        public string Category { get; set; }
        
        [JsonProperty("fields")]
        public VaultItemField[] Fields { get; set; }
        
        [JsonProperty("vault")]
        public VaultId Vault { get; set; }
    }
}