using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Renta.Components.Common.Providers
{
    internal sealed class TokenDataConverter : JsonConverter<TokenData>
    {
        public override void WriteJson(JsonWriter writer, TokenData value, JsonSerializer serializer)
        {
        }

        public override TokenData ReadJson(JsonReader reader, Type objectType, TokenData existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            JObject to = JObject.Load(reader);

            string fullTypeName = to[nameof(TokenData.TypeName)].Value<string>(); 
            
            Type type = Type.GetType(fullTypeName);

            TokenData data = (type != null)
                ? (to.ToObject(type) as TokenData)
                : null;

            return data;
        }
    }
}