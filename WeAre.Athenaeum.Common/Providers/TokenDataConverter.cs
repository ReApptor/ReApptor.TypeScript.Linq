using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WeAre.Athenaeum.Common.Providers
{
    internal sealed class TokenDataConverter : JsonConverter<TokenData>
    {
        public override void WriteJson(JsonWriter writer, TokenData value, JsonSerializer serializer)
        {
        }

        public override TokenData ReadJson(JsonReader reader, Type objectType, TokenData existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            JObject to = JObject.Load(reader);

            string propertyName = nameof(TokenData.TypeName);
            string fullTypeName = to[propertyName]?.Value<string>();

            Type type = (!string.IsNullOrWhiteSpace(fullTypeName))
                ? Type.GetType(fullTypeName)
                : null;

            TokenData data = (type != null)
                ? (to.ToObject(type) as TokenData)
                : null;

            return data;
        }
    }
}