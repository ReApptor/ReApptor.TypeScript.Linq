using System.Collections.Generic;
using System.Linq;
using Renta.TestApplication.Common;
using WeAre.Athenaeum.TemplateApp.Common;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Providers
{
    public static class PasswordValidator
    {
        public static PasswordValidationError[] Validate(string password)
        {
            var result = new List<PasswordValidationError>();

            if (string.IsNullOrEmpty(password) || (password.Length < TestApplicationConstants.Password.MinLength) || (password.Length > TestApplicationConstants.Password.MaxLength))
            {
                result.Add(PasswordValidationError.Length);
            }

            if (string.IsNullOrEmpty(password) || (!password.Any(char.IsLower)))
            {
                result.Add(PasswordValidationError.Lowercase);
            }
            
            if (string.IsNullOrEmpty(password) || (!password.Any(char.IsUpper)))
            {
                result.Add(PasswordValidationError.Uppercase);
            }
            
            if (string.IsNullOrEmpty(password) || (password.All(item => char.IsLetterOrDigit(item) || char.IsWhiteSpace(item))))
            {
                result.Add(PasswordValidationError.NonAlphabetic);
            }

            return result.ToArray();
        }
    }
}