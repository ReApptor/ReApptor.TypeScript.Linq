using System;
using System.Linq;
using WeAre.Athenaeum.Toolkit.Extensions;

namespace WeAre.Athenaeum.Common.Models
{
    public sealed class CountryInfo
    {
        public CountryInfo()
        {
            Aliases = new string[0];
        }

        public CountryInfo(string code, string name, string englishName, string culture, params string[] aliases)
        {
            if (code == null)
                throw new ArgumentNullException(nameof(code));
            if (string.IsNullOrWhiteSpace(code))
                throw new ArgumentOutOfRangeException(nameof(code), "Code is empty or whitespace.");
            if (name == null)
                throw new ArgumentNullException(nameof(name));
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentOutOfRangeException(nameof(name), "Native name is empty or whitespace.");
            if (englishName == null)
                throw new ArgumentNullException(nameof(englishName));
            if (string.IsNullOrWhiteSpace(englishName))
                throw new ArgumentOutOfRangeException(nameof(englishName), "English name is empty or whitespace.");
            if (culture == null)
                throw new ArgumentNullException(nameof(culture));
            if (string.IsNullOrWhiteSpace(culture))
                throw new ArgumentOutOfRangeException(nameof(culture), "Culture is empty or whitespace.");

            Code = code.Trim().ToLowerInvariant();
            Name = name.Trim();
            EnglishName = englishName.Trim();
            Culture = culture.Trim();
            Aliases = (aliases ?? new string[0]).AddRange(new[] {code, name, englishName, culture})
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => item.Trim())
                .Distinct()
                .ToArray();
        }
            
        /// <summary>
        /// Country native name
        /// </summary>
        public string Name { get; set; }
        
        /// <summary>
        /// Country english name
        /// </summary>
        public string EnglishName { get; set; }
        
        /// <summary>
        /// Country code
        /// </summary>
        public string Code { get; set; }
        
        public string Culture { get; set; }
            
        public string[] Aliases { get; set; }
    }
}