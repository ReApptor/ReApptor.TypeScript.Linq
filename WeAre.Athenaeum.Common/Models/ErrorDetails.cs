using System;
using Newtonsoft.Json;
using WeAre.Athenaeum.Toolkit;

namespace WeAre.Athenaeum.Common.Models
{
    public sealed class ErrorDetails
    {
        public ExceptionInfo Exception { get; set; }

        public int StatusCode { get; set; }

        public override string ToString()
        {
            var settings = new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore};
            return JsonConvert.SerializeObject(this, settings);
        }

        public static ErrorDetails TryDeserialize(string json)
        {
            if (!string.IsNullOrWhiteSpace(json))
            {
                try
                {
                    var settings = new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore};
                    return JsonConvert.DeserializeObject<ErrorDetails>(json, settings);
                }
                catch (Exception)
                {
                    return null;
                }
            }

            return null;
        }
    }
}