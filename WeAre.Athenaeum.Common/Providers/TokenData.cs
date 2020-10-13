using Newtonsoft.Json;
using WeAre.Athenaeum.Toolkit.Extensions;

namespace WeAre.Athenaeum.Common.Providers
{
    public abstract class TokenData
    {
        public string TypeName => GetType().GetFullName(false);

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }

        public static TData Deserialize<TData>(string json) where TData : TokenData
        {
            return (!string.IsNullOrWhiteSpace(json))
                ? JsonConvert.DeserializeObject<TData>(json, new JsonSerializerSettings {Converters = {new TokenDataConverter()}})
                : null;
        }
    }
}