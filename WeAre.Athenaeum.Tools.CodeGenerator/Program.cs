using System;
using System.Collections;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public class Program
    {
        /// <summary>
        /// "WeAre.Athenaeum.CodeGenerator"
        /// </summary>
        public const string Name = "WeAre.Athenaeum.CodeGenerator";

        /// <summary>
        /// "athenaeum.config.json"
        /// </summary>
        public const string SettingsFileName = "athenaeum.config.json";

        /// <summary>
        /// "$(PWD)"
        /// </summary>
        public const string ProjectDirectoryEnvironmentVariable = "$(PWD)";
        
        private static bool Command(string[] args, string command)
        {
            return ((args != null) && (args.Length > 0) &&
                    (args.Any(arg => (!string.IsNullOrWhiteSpace(arg)) && (arg.Trim().Trim('/').Equals(command, StringComparison.InvariantCultureIgnoreCase)))));
        }
        
        private static int Error(string message)
        {
            Console.ForegroundColor = ConsoleColor.DarkRed;
            Console.WriteLine(message);
            return -1;
        }

        private static int GenerateResources(string[] args)
        {
            string neutralResourcePath = args[0]?.Trim().Replace("\\\\", "\\");
            string destinationPath = args[1]?.Trim().Replace("\\\\", "\\");

            LocalizatorResourceManager.Type type = ((args.Length > 2) && (!string.IsNullOrWhiteSpace(args[2])) && (args[2].Trim() == "1"))
                ? LocalizatorResourceManager.Type.CSharp
                : LocalizatorResourceManager.Type.TypeScript;
         
            string neutralLanguage = ((args.Length > 3) && (!string.IsNullOrWhiteSpace(args[3])))
                ? args[3].Trim()
                : "fi";

            var settings = new LocalizatorResourceSettings
            {
                NeutralResourcePath = neutralResourcePath,
                DestinationPath = destinationPath,
                Type = type,
                NeutralLanguage = neutralLanguage
            };

            return GenerateResources(settings);
        }

        private static int GenerateResources(LocalizatorResourceSettings settings)
        {
            if (string.IsNullOrWhiteSpace(settings.NeutralResourcePath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"neutralResourcePath\" not specified.");
            }

            if (settings.NeutralResourcePath.StartsWith("/"))
            {
                settings.NeutralResourcePath = Path.Combine(Environment.CurrentDirectory, settings.NeutralResourcePath);
            }

            if (!File.Exists(settings.NeutralResourcePath))
            {
                return Error($"{Name}. Invalid input arguments. File from parameter \"neutralResourcePath\" (\"{settings.NeutralResourcePath}\") cannot be found.");
            }

            if (string.IsNullOrWhiteSpace(settings.DestinationPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"destinationPath\" not specified.");
            }

            if (settings.DestinationPath.StartsWith("/"))
            {
                settings.DestinationPath = Path.Combine(Environment.CurrentDirectory, settings.DestinationPath);
            }

            if ((!settings.SplitByComponent) && (!Directory.Exists(Path.GetDirectoryName(settings.DestinationPath))))
            {
                return Error($"{Name}. Invalid input arguments. Folder from parameter \"destinationPath\" (\"{settings.DestinationPath}\") cannot be found.");
            }

            Console.WriteLine($"{Name}: neutralResourcePath=\"{settings.NeutralResourcePath}\", destinationPath=\"{settings.DestinationPath}\" type=\"{settings.Type}\", neutralLanguage=\"{settings.NeutralLanguage}\".");
            
            LocalizatorResourceManager.Generate(settings);

            Console.WriteLine($"{Name}. Complete at {DateTime.Now:dd-MM-yyyy HH:mm:ss}.");

            return 0;
        }


        private static int GenerateEnumProvider(string[] args)
        {
            string solutionPath = (args.Length > 0)
                ? args[0]?.Trim().Replace("\\\\", "\\")
                : null;

            string projectPath = (args.Length > 1)
                ? args[1]?.Trim().Replace("\\\\", "\\")
                : null;

            string destinationPath = (args.Length > 2)
                ? args[2]?.Trim().Replace("\\\\", "\\")
                : null;

            string[] exclude = ((args.Length > 3) && (!string.IsNullOrWhiteSpace(args[3])))
                ? args[2]
                    .Split(new[] {",", ";"}, StringSplitOptions.RemoveEmptyEntries)
                    .Select(item => item.Trim())
                    .ToArray()
                : null;

            var settings = new EnumProviderSettings
            {
                SolutionPath = solutionPath,
                DestinationPath = destinationPath,
                ProjectPath = projectPath,
                Exclude = exclude
            };

            return GenerateEnumProvider(settings);
        }
        
        private static int GenerateEnumProvider(EnumProviderSettings settings)
        {
            if (string.IsNullOrWhiteSpace(settings.SolutionPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"solutionPath\" not specified.");
            }

            if (!Directory.Exists(settings.SolutionPath))
            {
                return Error($"{Name}. Invalid input arguments. Directory from parameter \"solutionPath\" (\"{settings.SolutionPath}\") cannot be found.");
            }
            
            if (string.IsNullOrWhiteSpace(settings.ProjectPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"projectPath\" not specified.");
            }

            if (settings.ProjectPath.StartsWith("/"))
            {
                settings.ProjectPath = Path.Combine(Environment.CurrentDirectory, settings.ProjectPath);
            }

            if (!File.Exists(settings.ProjectPath))
            {
                return Error($"{Name}. Invalid input arguments. File from parameter \"projectPath\" (\"{settings.ProjectPath}\") cannot be found.");
            }

            if (string.IsNullOrWhiteSpace(settings.DestinationPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"destinationPath\" not specified.");
            }

            if (settings.DestinationPath.StartsWith("/"))
            {
                settings.DestinationPath = Path.Combine(Environment.CurrentDirectory, settings.DestinationPath);
            }

            if (!Directory.Exists(Path.GetDirectoryName(settings.DestinationPath)))
            {
                return Error($"{Name}. Invalid input arguments. Folder from parameter \"destinationPath\" (\"{settings.DestinationPath}\") cannot be found.");
            }

            Console.WriteLine($"{Name}: projectPath=\"{settings.ProjectPath}\", destinationPath=\"{settings.DestinationPath}\" exclude=\"{string.Join("; ", (settings.Exclude ?? new string[0]))}\".");

            EnumProviderManager.Generate(settings);

            Console.WriteLine($"{Name}. Complete at {DateTime.Now:dd-MM-yyyy HH:mm:ss}.");

            return 0;
        }

        private static int Generate(Settings settings)
        {
            LocalizatorResourceSettings[] localizators = settings
                                                             .Localizator?
                                                             .Where(item => item != null)
                                                             .ToArray();

            if (localizators != null)
            {
                foreach (LocalizatorResourceSettings localizator in localizators)
                {
                    int result = GenerateResources(localizator);
                    if (result != 0)
                    {
                        return result;
                    }
                }
            }

            return 0;
        }

        private static string GetProjectDirectory()
        {
            string projectDirectory = Environment.GetEnvironmentVariable(ProjectDirectoryEnvironmentVariable);
            return (!string.IsNullOrWhiteSpace(projectDirectory))
                ? projectDirectory
                : Directory.GetCurrentDirectory();
        }

        private static string ProcessEnvVariables(string data)
        {
            string projectDirectory = GetProjectDirectory();
            data = data.Replace("$(ProjectDir)", projectDirectory);
            data = data.Replace(ProjectDirectoryEnvironmentVariable, projectDirectory);
            IDictionary variables = Environment.GetEnvironmentVariables();
            foreach (DictionaryEntry keyValue in variables)
            {
                string key = $"$({keyValue.Key as string})";
                if ((key != ProjectDirectoryEnvironmentVariable) && (data.Contains(key)))
                {
                    string value = (keyValue.Value as string) ?? string.Empty;
                    data = data.Replace(key, value);
                }
            }

            return data;
        }

        private static Settings GetSettings(string path)
        {
            Console.WriteLine($"{Name}. Fetching settings from \"{path}\".");

            string json = File.ReadAllText(path);

            json = ProcessEnvVariables(json);
                    
            var settings = JsonConvert.DeserializeObject<Settings>(json);

            return settings;
        }

        public static int Main(string[] args)
        {
            // <Exec Command="dotnet run --project &quot;$(ProjectDir)../Renta.Tools.CodeGenerator/Renta.Tools.CodeGenerator.csproj&quot; &quot;$(ProjectDir)SharedResources.resx&quot; &quot;$(ProjectDir)../Renta.Tools.WebUI.Resources/SharedResources.cs&quot; 1 fi" />
            // <Exec Command="dotnet run --project &quot;$(ProjectDir)../Renta.Tools.CodeGenerator/Renta.Tools.CodeGenerator.csproj&quot; &quot;$(ProjectDir)SharedResources.resx&quot; &quot;$(ProjectDir)../Renta.Tools.WebUI/src/localization/Localizer.ts&quot; 0 fi" />
            
            try
            {
                if ((args == null) || (args.Length == 0))
                {
                    string settingsFile = Path.Combine(Environment.CurrentDirectory, SettingsFileName);
                    if (!File.Exists(settingsFile))
                    {
                        string projectDirectory = GetProjectDirectory();
                        settingsFile = Path.Combine(projectDirectory, SettingsFileName);
                        if (!File.Exists(settingsFile))
                        {
                            DirectoryInfo parent = Directory.GetParent(projectDirectory);
                            settingsFile = Path.Combine(parent.FullName, SettingsFileName);
                            if (!File.Exists(settingsFile))
                            {
                                return Error($"{Name}. Invalid input arguments. Settings file cannot be found in project or solution directories.");
                            }
                        }
                    }
                    
                    Settings settings = GetSettings(settingsFile);

                    return Generate(settings);
                }

                if (!string.IsNullOrWhiteSpace(args[0]) && (args[0].EndsWith(".json", StringComparison.InvariantCultureIgnoreCase)))
                {
                    if (!File.Exists(args[0]))
                    {
                        return Error($"{Name}. Invalid input arguments. Setting file (\"{args[0]}\") cannot be found.");
                    }

                    Settings settings = GetSettings(args[0]);

                    return Generate(settings);
                }
                
                if (Command(args, "EnumProvider"))
                {
                    return GenerateEnumProvider(args);
                }

                return GenerateResources(args);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.DarkRed;
                Console.WriteLine($"{Name}. Exception occured.");
                
                while (ex != null)
                {
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(ex.StackTrace);
                    ex = ex.InnerException;
                }
                
                return -2;
            }
        }
    }
}