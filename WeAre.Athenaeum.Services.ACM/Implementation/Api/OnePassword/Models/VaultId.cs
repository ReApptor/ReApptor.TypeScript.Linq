using System;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Services.ACM.Implementation.API.OnePassword.Models
{
    public sealed class VaultId
    {
        public VaultId(string vaultId)
        {
            Id = vaultId;
        }
        
        [JsonProperty("id")]
        public string Id { get; set; }
    }
}