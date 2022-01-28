using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models.VaultItem
{
    public sealed class VaultItemUrl
    {
        [JsonProperty("primary")]
        public bool Primary { get; set; }
        
        /// <summary>
        /// The title of the item.
        /// </summary>
        [JsonProperty("href")]
        public string Href { get; set; }
    }
}