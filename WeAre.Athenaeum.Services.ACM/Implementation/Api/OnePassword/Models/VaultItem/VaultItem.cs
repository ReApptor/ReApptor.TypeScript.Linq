using System;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItem
{
    public sealed class VaultItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        /// <summary>
        /// The title of the item.
        /// </summary>
        [JsonProperty("title")]
        public string Title { get; set; }

        /// <summary>
        /// An object containing an id property whose value is the UUID of the vault the item is in.
        /// </summary>
        [JsonProperty("vault")]
        public VaultId Vault { get; set; }
        
        /// <summary>
        /// See VaultItemCategory for details.
        /// </summary>
        [JsonProperty("category")]
        public string Category { get; set; }
        
        /// <summary>
        /// Array of URL objects containing URLs for the item.
        /// </summary>
        [JsonProperty("urls")]
        public Uri[] Urls { get; set; }

        /// <summary>
        /// Mark the item as a favorite.
        /// </summary>
        [JsonProperty("favorite")]
        public bool Favorite { get; set; }
        
        /// <summary>
        /// An array of strings of the tags assigned to the item.
        /// </summary>
        [JsonProperty("tags")]
        public string[] Tags { get; set; }
        
        /// <summary>
        /// The version of the item.
        /// </summary>
        [JsonProperty("version")]
        public int Version { get; set; }
        
        /// <summary>
        /// See VaultItemState for details.
        /// </summary>
        [JsonProperty("state", NullValueHandling=NullValueHandling.Ignore)]
        public string State { get; set; }
        
        /// <summary>
        /// An array of VaultItemField objects of the fields to include with the item.
        /// </summary>
        [JsonProperty("fields")]
        public VaultItemField[] Fields { get; set; }
        
        /// <summary>
        /// An array of Section objects of the sections to include with the item.
        /// </summary>
        [JsonProperty("sections")]
        public VaultItemSection[] Sections { get; set; }

        [JsonProperty("lastEditedBy")]
        public string LastEditedBy{ get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt{ get; set; }
        
        [JsonProperty("updatedAt")]
        public DateTime UpdatedAt{ get; set; }

        public void Validate()
        {
            if (Title == null)
                throw new ArgumentNullException(nameof(Title));
            if (string.IsNullOrWhiteSpace(Title))
                throw new ArgumentOutOfRangeException(nameof(Title), "Title is empty or whitespace.");
            if (Vault == null)
                throw new ArgumentNullException(nameof(Vault));
            if (string.IsNullOrWhiteSpace(Vault.Id))
                throw new ArgumentOutOfRangeException(nameof(Vault), "Vault id is empty or whitespace.");
            if (Category == null)
                throw new ArgumentNullException(nameof(Category));
            if (string.IsNullOrWhiteSpace(Category))
                throw new ArgumentOutOfRangeException(nameof(Category), "Category is empty or whitespace.");
        }
    }
}