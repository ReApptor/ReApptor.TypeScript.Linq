using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Xml;
using System.Xml.Serialization;

namespace WeAre.ReApptor.Tools.CodeGenerator
{
    public static class LocalizatorResourceManager
    {
        [XmlRoot("root")]
        public sealed class ResourceDocument
        {
            public sealed class Item
            {
                [XmlAttribute("name")]
                public string Name { get; set; }

                [XmlElement("value")]
                public string Value { get; set; }
            }

            [XmlElement("data")]
            public Item[] Items { get; set; }
        }

        public sealed class Component
        {
            public string Name { get; set; }
            
            public string FullName { get; set; }
            
            public string DestinationPath { get; set; }
        }

        private static ResourceDocument Deserialize(XmlDocument doc)
        {
            using (var reader = new XmlNodeReader(doc.DocumentElement))
            {
                var serializer = new XmlSerializer(typeof(ResourceDocument));
                return (ResourceDocument)serializer.Deserialize(reader);
            }
        }

        private static ResourceDocument Deserialize(string path)
        {
            var doc = new XmlDocument();
            doc.Load(path);
            return Deserialize(doc);
        }

        private static Dictionary<string, ResourceDocument> LoadResources(string neutralResourcePath, string neutralLanguage)
        {
            string name = Path.GetFileNameWithoutExtension(neutralResourcePath);
            string folder = Path.GetDirectoryName(neutralResourcePath);
            var directory = new DirectoryInfo(folder);
            
            IEnumerable<string> languageResources = directory
                .GetFiles($"{name}.*.resx", SearchOption.TopDirectoryOnly)
                .OrderByDescending(file => file.Name)
                .Select(file => file.FullName);
            
            var resources = new Dictionary<string, ResourceDocument>
            {
                {neutralLanguage, Deserialize(neutralResourcePath)}
            };

            foreach (string languageResource in languageResources)
            {
                string fileName = Path.GetFileNameWithoutExtension(languageResource);
                string language = fileName.Substring(name.Length + 1, fileName.Length - name.Length - 1);
                resources.Add(language, Deserialize(languageResource));
            }

            return resources;
        }

        private static string ExtractComponentName(string languageItemName)
        {
            return languageItemName.Split('.').LastOrDefault();
        }

        private static Component[] GetSplittedDestinationFiles(Dictionary<string, Dictionary<string, string>> items, string destinationPathPattern)
        {
            bool supportFullName = destinationPathPattern.Contains(LocalizatorResourceSettings.ComponentFullNameTag);
            
            var components = new Dictionary<string, Component>();

            foreach (string languageItemName in items.Keys)
            {
                string[] componentNameElements = languageItemName.Split(new[] {"."}, StringSplitOptions.RemoveEmptyEntries);

                bool canBeLongName = (supportFullName) && (componentNameElements.Length > 1);

                string name = (canBeLongName)
                    ? componentNameElements[1]
                    : componentNameElements[0];
                string fullName = (canBeLongName)
                    ? $"{componentNameElements[0]}.{componentNameElements[1]}"
                    : componentNameElements[0];

                string path = destinationPathPattern
                    .Replace(LocalizatorResourceSettings.ComponentFullNameTag, fullName)
                    .Replace(LocalizatorResourceSettings.ComponentNameTag, name);

                string directory = Path.GetDirectoryName(path);

                bool exists = Directory.Exists(directory);

                if ((!exists) && (canBeLongName))
                {
                    name = componentNameElements[0];
                    fullName = componentNameElements[0];

                    path = destinationPathPattern
                        .Replace(LocalizatorResourceSettings.ComponentFullNameTag, fullName)
                        .Replace(LocalizatorResourceSettings.ComponentNameTag, name);

                    directory = Path.GetDirectoryName(path);

                    exists = Directory.Exists(directory);
                }
                
                if (!exists)
                    throw new InvalidOperationException($"{Program.Name}: The folder \"{directory}\" cannot be found for component \"{fullName}\".");

                if (!components.ContainsKey(fullName))
                {
                    components.Add(fullName, new Component {Name = name, FullName = fullName, DestinationPath = path});
                }
            }

            Console.WriteLine("Components to generate: {0}.", string.Join(", ", components.Keys.Select(item => $"\"{item}\"")));

            return components.Values.ToArray();
        }

        private static bool Exclude(string[] excludePatterns, string name)
        {
            if (excludePatterns.Length == 0)
            {
                return false;
            }
            
            return excludePatterns.Any(pattern => Regex.IsMatch(name, pattern));
        }

        private static bool Include(string[] includePatterns, string name)
        {
            if (includePatterns.Length == 0)
            {
                return true;
            }
            
            return includePatterns.Any(pattern => Regex.IsMatch(name, pattern));
        }

        private static string WildCardToRegular(string value)
        {
            return "^" + Regex.Escape(value).Replace("\\?", ".").Replace("\\*", ".*") + "$";
        }

        private static Dictionary<string, Dictionary<string, string>> LoadLanguageItems(string neutralResourcePath, string neutralLanguage, string[] include, string[] exclude, out CultureInfo[] cultures)
        {
            string[] includePatterns = (include ?? new string[0])
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => WildCardToRegular(item.Trim()))
                .ToArray();

            string[] excludePatterns = (exclude ?? new string[0])
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => WildCardToRegular(item.Trim()))
                .ToArray();

            Dictionary<string, ResourceDocument> resources = LoadResources(neutralResourcePath, neutralLanguage);

            var cultureItems = new List<CultureInfo>();
            var items = new Dictionary<string, Dictionary<string, string>>();
            foreach (KeyValuePair<string, ResourceDocument> pair in resources)
            {
                string language = pair.Key;
                if (language != neutralLanguage)
                {
                    var culture = new CultureInfo(language);
                    cultureItems.Add(culture);
                }

                ResourceDocument doc = pair.Value;
                if (doc.Items != null)
                {
                    foreach (ResourceDocument.Item item in doc.Items)
                    {
                        string name = item.Name;

                        bool excludeItem = Exclude(excludePatterns, name);
                        bool includeItem = (!excludeItem) && Include(includePatterns, name);

                        if (includeItem)
                        {
                            Dictionary<string, string> languages;
                            if (!items.ContainsKey(name))
                            {
                                languages = new Dictionary<string, string>();
                                items.Add(name, languages);
                            }
                            else
                            {
                                languages = items[name];
                            }

                            if (!languages.ContainsKey(language))
                            {
                                languages.Add(language, item.Value);
                            }
                        }
                    }
                }
            }

            cultureItems = cultureItems.OrderBy(item => item.DisplayName).ToList();
            cultureItems.Insert(0, new CultureInfo(neutralLanguage));

            cultures = cultureItems.ToArray();

            return items;
        }

        private static Dictionary<string, Dictionary<string, string>> Filter(Dictionary<string, Dictionary<string, string>> items, string componentName)
        {
            string prefix = $"{componentName}.";
            int prefixLength = prefix.Length;
            var result = new Dictionary<string, Dictionary<string, string>>();
            foreach (KeyValuePair<string, Dictionary<string, string>> languageItems in items)
            {
                bool include = (languageItems.Key.StartsWith(prefix));
                if (include)
                {
                    string key = languageItems.Key.Substring(prefixLength);
                    result.Add(key, languageItems.Value);
                }
            }

            return result;
        }

        private static string ToVariableName(string name, bool toLowercase)
        {
            name = name.Replace(".", "").Replace("_", "");
            if (toLowercase)
            {
                name = (name.Length > 1)
                    ? $"{name.Substring(0, 1).ToLowerInvariant()}{name.Substring(1)}"
                    : name.ToLowerInvariant();
            }
            return name;
        }

        private static string GetNativeName(CultureInfo culture)
        {
            string name = culture.NativeName;
            name = $"{name.Substring(0, 1).ToUpper(culture)}{name.Substring(1)}";
            return name;
        }

        private static string EscapeValue(string value, bool escapeDoubleQuotes = false)
        {
            const string newLineCode = "&#xA;";
            value ??= string.Empty;
            value = value
                .Replace("\r\n", EscapedNewLine)
                .Replace("\n", EscapedNewLine)
                .Replace("`", "\\`")
                .Replace(newLineCode, EscapedNewLine);
            
            if (escapeDoubleQuotes)
            {
                value = value.Replace("\"", "\\\"");
            }

            value = value
                .Replace("[mark]", "<mark>")
                .Replace("[/mark]", "</mark>");
            
            return value;
        }

        private static string GetEnValue(Dictionary<string, string> items, string neutralLanguage, bool escapeDoubleQuotes = false)
        {
            string value = (items.ContainsKey("en"))
                ? items["en"]
                : items.ContainsKey(neutralLanguage)
                    ? items[neutralLanguage]
                    : items.Values.First();
            
            return EscapeValue(value, escapeDoubleQuotes);
        }

        private static string GenerateTypeScriptContent(Dictionary<string, Dictionary<string, string>> languageItems, CultureInfo[] cultures, string neutralLanguage, string import, string className, string baseClassName)
        {
            import = (!string.IsNullOrWhiteSpace(import))
                ? import.Trim()
                : @"import {BaseLocalizer} from ""@weare/athenaeum-toolkit"";";

            if (!import.EndsWith(";"))
            {
                import += ";";
            }
            
            baseClassName = (!string.IsNullOrWhiteSpace(baseClassName))
                ? baseClassName.Trim()
                : @"BaseLocalizer";
            
            className = (!string.IsNullOrWhiteSpace(className))
                ? className.Trim()
                : @"Localizer";
            
            var languages = new StringBuilder();
            foreach (CultureInfo culture in cultures)
            {
                languages.Append($"                {{ code: \"{culture.TwoLetterISOLanguageName}\", label: \"{GetNativeName(culture)}\" }},");
                languages.Append(NewLine);
            }

            languages.Length -= (NewLine.Length + 1);

            var constants = new StringBuilder();
            var initializer = new StringBuilder();
            var properties = new StringBuilder();
            foreach (KeyValuePair<string, Dictionary<string, string>> pair in languageItems)
            {
                if (pair.Value.Count > 0)
                {
                    string name = pair.Key;
                    string enValue = GetEnValue(pair.Value, neutralLanguage);
                    string variableName = ToVariableName(name, true);
                    initializer.Append($"        this.set(this.{variableName}LanguageItemName, ");
                    foreach (KeyValuePair<string, string> item in pair.Value)
                    {
                        initializer.Append($"{{ language: `{item.Key}`, value: `{EscapeValue(item.Value)}` }}, ");
                    }

                    initializer.Length -= NewLine.Length;
                    initializer.Append(");");
                    initializer.Append(NewLine);

                    properties.Append($"    /**");
                    properties.Append(NewLine);
                    properties.Append($"    /* \"{name}\" ({enValue})");
                    properties.Append(NewLine);
                    properties.Append($"    */");
                    properties.Append(NewLine);
                    properties.Append($"    public get {variableName}() : string {{");
                    properties.Append(NewLine);
                    properties.Append($"        return this.get(this.{variableName}LanguageItemName);");
                    properties.Append(NewLine);
                    properties.Append($"    }}");
                    properties.Append(NewLine);
                    properties.Append(NewLine);

                    constants.Append($"    public readonly {variableName}LanguageItemName: string = `{name}`;");
                    constants.Append(NewLine);
                }
            }

            if (initializer.Length > 0)
            {
                initializer.Length -= NewLine.Length;
            }

            if (properties.Length > 0)
            {
                properties.Length -= 2 * NewLine.Length;
            }

            if (constants.Length > 0)
            {
                constants.Length -= NewLine.Length;
            }

            string text = string.Format(
@"//Autogenerated

{0}

class {1} extends {2} {{

    //Constants
{3}

    constructor() {{

        super(
            [
{4}
            ],
            ""{5}"");
        
        //Initializer
{6}
    }}

{7}
}}

//Singleton
export default new {8}();", import, className, baseClassName, constants, languages, neutralLanguage, initializer, properties, className);

            return text;
        }

        private static string GenerateCSharpContent(Dictionary<string, Dictionary<string, string>> languageItems, CultureInfo[] cultures, string neutralLanguage, string @namespace, string className)
        {
            var languages = new StringBuilder();
            languages.Append("        public static readonly ReadOnlyCollection<CultureInfo> SupportedCultures = new ReadOnlyCollection<CultureInfo>(new[]");
            languages.Append(NewLine);
            languages.Append("        {");
            languages.Append(NewLine);
            foreach (CultureInfo culture in cultures)
            {
                languages.Append($"            new CultureInfo(\"{culture.Name}\"),");
                languages.Append(NewLine);
            }

            languages.Append("        });");

            var constants = new StringBuilder();
            foreach (KeyValuePair<string, Dictionary<string, string>> pair in languageItems)
            {
                if (pair.Value.Count > 0)
                {
                    string name = pair.Key;
                    string enValue = GetEnValue(pair.Value, neutralLanguage, true);
                    string variableName = ToVariableName(name, false);

                    constants.Append($"        /// <summary>");
                    constants.Append(NewLine);
                    constants.Append($"        /// \"{name}\" ({enValue})");
                    constants.Append(NewLine);
                    constants.Append($"        /// </summary>");
                    constants.Append(NewLine);
                    constants.Append($"        public const string {variableName} = @\"{name}\";");
                    constants.Append(NewLine);
                    constants.Append(NewLine);
                }
            }

            string text = string.Format(
@"//Autogenerated

using System.Collections.ObjectModel;
using System.Globalization;

namespace {0}
{{
    public static class {1}
    {{
{2}

        public static readonly CultureInfo DefaultCulture = new CultureInfo(""{3}"");

{4}
    }}
}}
", @namespace, className, languages, neutralLanguage, constants.ToString().TrimEnd());

            return text;
        }

        private static void GenerateFile(LocalizatorResourceSettings settings, Dictionary<string, Dictionary<string, string>> languageItems, CultureInfo[] cultures, string destinationPath)
        {
            string className = Path.GetFileNameWithoutExtension(destinationPath);

            string content;
            if (settings.Type == Type.TypeScript)
            {
                content = GenerateTypeScriptContent(languageItems, cultures, settings.NeutralLanguage, settings.Import, className, settings.BaseClassName);
            }
            else
            {
                string @namespace = (!string.IsNullOrWhiteSpace(settings.Namespace))
                    ? settings.Namespace.Trim()
                    : Path.GetFileName(Path.GetDirectoryName(destinationPath));

                content = GenerateCSharpContent(languageItems, cultures, settings.NeutralLanguage, @namespace, className);
            }

            bool equals = false;
            if (File.Exists(destinationPath))
            {
                string existingContent = File.ReadAllText(destinationPath, Encoding.UTF8);
                equals = (existingContent == content);
            }

            if (!equals)
            {
                byte[] rawData = Encoding.UTF8.GetBytes(content);
                File.WriteAllBytes(destinationPath, rawData);
                //File.WriteAllText(destinationPath, content, Encoding.UTF8);
            }
        }
        
        //public static void Generate(string neutralResourcePath, string destinationPath, Type type, string neutralLanguage)
        public static void Generate(LocalizatorResourceSettings settings)
        {
            if (settings == null)
                throw new ArgumentNullException(nameof(settings)); 
            
            try
            {
                var culture = new CultureInfo("fi");
                Thread.CurrentThread.CurrentCulture = culture;
                Thread.CurrentThread.CurrentUICulture = culture;

                Dictionary<string, Dictionary<string, string>> languageItems = LoadLanguageItems(settings.NeutralResourcePath, settings.NeutralLanguage, settings.Include, settings.Exclude, out CultureInfo[] cultures);

                if (settings.SplitByComponent)
                {
                    Component[] splittedDestinationFiles = GetSplittedDestinationFiles(languageItems, settings.DestinationPath);

                    foreach (Component item in splittedDestinationFiles)
                    {
                        Dictionary<string, Dictionary<string, string>> componentLanguageItems = Filter(languageItems, item.Name);
                        
                        GenerateFile(settings, componentLanguageItems, cultures, item.DestinationPath);
                    }
                }
                else
                {
                    GenerateFile(settings, languageItems, cultures, settings.DestinationPath);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("File cannot be generated. See inner exception for details.", ex);
            }
        }

        public enum Type
        {
            TypeScript = 0,

            CSharp = 1
        }
        
        /// <summary>
        /// "\n"
        /// </summary>
        public const string NewLine = "\n";

        /// <summary>
        /// "\\n"
        /// </summary>
        public const string EscapedNewLine = "\\n";
    }
}