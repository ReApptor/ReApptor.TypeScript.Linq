namespace Renta.Apps.Common.Extensions
{
    public static class StringExtensions
    {
        public static string NormalizeUsername(this string username)
        {
            return (username != null)
                ? username.Replace(" ", string.Empty).ToLowerInvariant()
                : string.Empty;
        }
    }
}