using System.Collections.Generic;
using Newtonsoft.Json;

namespace WeAre.ReApptor.Services.ACM.Implementation.Api.OnePassword.Models.VaultItem
{
    public class VaultItemDetailsPatch
    {
        #region Constructors
        
        public VaultItemDetailsPatch()
        {
        }

        public VaultItemDetailsPatch(string path, string value)
        {
            Path = path;
            Value = value;
        }

        public VaultItemDetailsPatch(KeyValuePair<string, string> pair)
        {
            Path = pair.Key;
            Value = pair.Value;
        }
        
        #endregion

        /// <summary>
        /// Add, Remove, Replace
        /// </summary>
        [JsonProperty("op")]
        public VaultItemDetailsPatchOperation Operation { get; set; } = VaultItemDetailsPatchOperation.Replace;
        
        /// <summary>
        /// For example: "/fields/vy09gd8EXAMPLE/label"
        /// </summary>
        [JsonProperty("path")]
        public string Path { get; set; }
        
        /// <summary>
        /// nullable: true
        /// </summary>
        [JsonProperty("value")]
        public string Value { get; set; }
    }
}