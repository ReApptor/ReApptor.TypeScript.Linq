using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models
{
    public sealed class VaultId
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }
}