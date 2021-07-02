using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace WeAre.Athenaeum.Services.ACM.Implementation.Api.OnePassword.Models.VaultItem
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum VaultItemDetailsPatchOperation
    {
        [JsonProperty("add")]
        Add,
        
        [JsonProperty("remove")]
        Remove,
        
        [JsonProperty("replace")]
        Replace
    }
}