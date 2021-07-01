using System;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultReference
{
    public sealed class VaultReference
    {
        /// <summary>
        /// The UUID of the vault.
        /// </summary>
        [JsonProperty("id")]
        public string Id { get; set; }
        
        /// <summary>
        /// The name of the vault.
        /// </summary>
        [JsonProperty("name")]
        public string Name { get; set; }
        
        /// <summary>
        /// The description for the vault.
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }

        /// <summary>
        /// The version of the vault metadata.
        /// </summary>
        [JsonProperty("attributeVersion")]
        public int AttributeVersion { get; set; }
        
        /// <summary>
        /// The version of the vault contents.
        /// </summary>
        [JsonProperty("contentVersion")]
        public int ContentVersion { get; set; }
        
        /// <summary>
        /// Number of active items in the vault.
        /// </summary>
        [JsonProperty("items")]
        public int Items { get; set; }
        
        /// <summary>
        /// See VaultReferenceType for details.
        /// </summary>
        [JsonProperty("type")]
        public string Type { get; set; }
        
        /// <summary>
        /// Date and time when the vault was created.
        /// </summary>
        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// Date and time when the vault or its contents were last changed.
        /// </summary>
        [JsonProperty("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}