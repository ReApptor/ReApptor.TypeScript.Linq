using Newtonsoft.Json;

namespace WeAre.ReApptor.Services.ACM.Implementation.API.OnePassword.Models.VaultItem
{
    public sealed class VaultItemSection
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }
    }
}