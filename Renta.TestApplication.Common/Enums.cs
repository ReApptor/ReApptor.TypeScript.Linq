
namespace Renta.TestApplication.Common
{
    public enum WebApplicationType
    {
        DesktopBrowser,

        MobileBrowser,

        MobileApp,

        PwaApp
    }
    
    public enum PasswordValidationError
    {
        /// <summary>
        /// One lowercase ('a'-'z') characters.
        /// </summary>
        Lowercase,
    
        /// <summary>
        /// One uppercase ('A'-'Z') characters.
        /// </summary>
        Uppercase,
    
        /// <summary>
        /// One non alphanumeric characters.
        /// </summary>
        NonAlphabetic,
    
        /// <summary>
        /// Min 6 and at max 100 characters long.
        /// </summary>
        Length
    }
}