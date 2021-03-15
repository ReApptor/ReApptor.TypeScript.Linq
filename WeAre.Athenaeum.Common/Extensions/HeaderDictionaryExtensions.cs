using Microsoft.AspNetCore.Http;

 namespace WeAre.Athenaeum.Common.Extensions
{
    public static class HeaderDictionaryExtensions
    {
        public static string Find(this IHeaderDictionary headers, string name)
        {
            if ((headers != null) && (!string.IsNullOrWhiteSpace(name)) && (headers.ContainsKey(name)) && (headers.ContainsKey(name)))
            {
                string value = headers[name].ToString();
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return value;
                }
            }

            return null;
        }
    }
}