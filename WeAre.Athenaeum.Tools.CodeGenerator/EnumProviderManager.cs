using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public static class EnumProviderManager
    {
        private static readonly Dictionary<string, KeyValuePair<DateTime, Assembly>> Assemblies = new Dictionary<string, KeyValuePair<DateTime, Assembly>>();

        private static void LoadAssemblies(string binDirectory)
        {
            string[] binAssemblies = Directory.GetFiles(binDirectory, "*.dll", SearchOption.AllDirectories);
            int count = binAssemblies.Length;
            
            for (int i = 0; i < count; i++)
            {
                try
                {
                    string assemblyPath = binAssemblies[i].ToLowerInvariant();
                    AssemblyName assemblyName = AssemblyName.GetAssemblyName(assemblyPath);
                    string name = assemblyName.FullName;
                    if (!string.IsNullOrWhiteSpace(name))
                    {
                        DateTime timespan = new FileInfo(assemblyPath).LastWriteTimeUtc;

                        if (Assemblies.ContainsKey(name))
                        {
                            KeyValuePair<DateTime, Assembly> info = Assemblies[name];
                            if (timespan > info.Key)
                            {
                                Assembly assembly = Assembly.LoadFile(assemblyPath);
                                Assemblies[name] = new KeyValuePair<DateTime, Assembly>(timespan, assembly);
                            }
                        }
                        else
                        {
                            Assembly assembly = Assembly.LoadFile(assemblyPath);
                            KeyValuePair<DateTime, Assembly> info = new KeyValuePair<DateTime, Assembly>(timespan, assembly);
                            Assemblies.Add(name, info);
                        }
                    }
                }
                catch (FileNotFoundException)
                {
                }
                catch (FileLoadException)
                {
                }
                catch (BadImageFormatException)
                {
                }
            }
        }
        
        private static Assembly AssemblyResolve(object sender, ResolveEventArgs args)
        {
            Assembly assembly = args.RequestingAssembly;
            string assemblyFullName = args.Name ?? assembly?.FullName;

            if ((!string.IsNullOrWhiteSpace(assemblyFullName)) && (Assemblies.ContainsKey(assemblyFullName)))
            {
                return Assemblies[assemblyFullName].Value;
            }

            return assembly;
        }

        private static Type[] GetEnums(string solutionDirectory, string targetPath, string[] exclude = null)
        {
            LoadAssemblies(solutionDirectory);

            AppDomain.CurrentDomain.AssemblyResolve += AssemblyResolve;

            Assembly assembly = Assembly.LoadFile(targetPath);

            Type[] enums = assembly
                .GetTypes()
                .Where(type => (type.IsEnum) && (type.GetCustomAttribute<FlagsAttribute>() == null))
                .ToArray();
            
            if ((exclude != null) && (exclude.Length > 0))
            {
                enums = enums
                    .Where(@enum => !exclude.Any(item => (!string.IsNullOrWhiteSpace(item)) && (item.Equals(@enum.Name, StringComparison.InvariantCultureIgnoreCase))))
                    .ToArray();
            }
            
            return enums;
        }

        private static string ProcessEnumsImport(string enumsImport, string names)
        {
            enumsImport = (!string.IsNullOrWhiteSpace(enumsImport))
                ? enumsImport.Trim()
                : @"from ""@/models/Enums"";";

            enumsImport = (enumsImport.StartsWith("import "))
                ? enumsImport.Replace("{{0}}", names)
                : $"import {{{names}}} from \"{enumsImport}\";";
            
            enumsImport = enumsImport.TrimEnd(';');
            enumsImport += ";";

            return enumsImport;
        }

        private static string ProcessSelectListItemImport(string selectListItemImport)
        {
            selectListItemImport = selectListItemImport.Trim();
            if (!selectListItemImport.StartsWith("import "))
            {
                selectListItemImport = $"import {{SelectListItem}} from \"{selectListItemImport}\";";
            }

            selectListItemImport = selectListItemImport.TrimEnd(';');
            selectListItemImport += ";";

            return selectListItemImport;
        }

        private static string GenerateTypeScriptContent(Type[] enums, string enumsImport, string selectListItemImport)
        {
            var systemNames = new HashSet<string>(new[] { "SortDirection", "WebApplicationType"});
            string names = string.Join(", ", enums.Select(item => item.Name).Where(item => !systemNames.Contains(item)));
            string quotedNames = string.Join(", ", enums.Select(item => $"\"{item.Name}\""));

            enumsImport = ProcessEnumsImport(enumsImport, names);

            selectListItemImport = ProcessSelectListItemImport(selectListItemImport);
            
            var items = new List<string>();
            
            foreach (Type @enum in enums)
            {
                string item = string.Format(
@"
    // #region {0}

    public get{0}Item(value: {0}): SelectListItem {{
        return this.transform({0}, ""{0}"", value);
    }}

    public get{0}Items(reverse: boolean = false): SelectListItem[] {{
        return this.getItems({0}, ""{0}"", reverse);
    }}

    public get{0}Name(value: {0}): string {{
        return this.get{0}Item(value).text;
    }}

    public get{0}Text(value: {0}): string {{
        return this.localizer.get(this.get{0}Name(value));
    }}

    public get{0}Description(value: {0}): string {{
        return this.get{0}Item(value).subtext;
    }}

    // #endregion
", @enum.Name);
                
                items.Add(item);
            }

            string itemsContent = string.Join("", items).Trim();

            string text = string.Format(
@"//Autogenerated

import {{BaseEnumProvider, SortDirection}} from ""@weare/athenaeum-toolkit"";
import {{WebApplicationType}} from ""@weare/athenaeum-react-common"";
{0}
{1}

class EnumProvider extends BaseEnumProvider<SelectListItem> {{

    // #region Private

    
    private readonly _types: string[] = [{2}];

    protected get types(): readonly string[] {{
        return this._types;
    }}

    protected createSelectListItem(value: string, text: string, subtext: string): SelectListItem {{
        return new SelectListItem(value, text, subtext);
    }}
    
    // #endregion
    
    constructor() {{
        super();
    }}

    {3}
}}

//Singleton
export default new EnumProvider();", selectListItemImport, enumsImport, quotedNames, itemsContent);

            return text;
        }

        // string solutionPath, string projectPath, string destinationPath, string[] exclude = null
        public static void Generate(EnumProviderSettings settings)
        {
            if (settings == null)
                throw new ArgumentNullException(nameof(settings)); 
            
            try
            {
                Type[] enums = GetEnums(settings.SolutionDir, settings.TargetPath, settings.Exclude);

                string content = GenerateTypeScriptContent(enums, settings.EnumsImport, settings.SelectListItemImport);

                bool equals = false;
                if (File.Exists(settings.DestinationPath))
                {
                    string existingContent = File.ReadAllText(settings.DestinationPath, Encoding.UTF8);
                    equals = (existingContent == content);
                }

                if (!equals)
                {
                    byte[] rawData = Encoding.UTF8.GetBytes(content);
                    File.WriteAllBytes(settings.DestinationPath, rawData);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("File cannot be generated. See inner exception for details.", ex);
            }
        }
    }
}