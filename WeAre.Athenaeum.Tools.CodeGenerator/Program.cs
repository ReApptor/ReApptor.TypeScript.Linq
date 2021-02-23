using System;
using System.Collections;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    class Program
    {
        /// <summary>
        /// "WeAre.Athenaeum.CodeGenerator"
        /// </summary>
        private const string Name = "WeAre.Athenaeum.CodeGenerator";
        
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
            string neutralResourcePath = settings.NeutralResourcePath;
            string destinationPath = settings.DestinationPath;
            
            if (string.IsNullOrWhiteSpace(neutralResourcePath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"neutralResourcePath\" not specified.");
            }

            if (neutralResourcePath.StartsWith("/"))
            {
                neutralResourcePath = Path.Combine(Environment.CurrentDirectory, neutralResourcePath);
            }

            if (!File.Exists(neutralResourcePath))
            {
                return Error($"{Name}. Invalid input arguments. File from parameter \"neutralResourcePath\" (\"{neutralResourcePath}\") cannot be found.");
            }

            if (string.IsNullOrWhiteSpace(destinationPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"destinationPath\" not specified.");
            }

            if (destinationPath.StartsWith("/"))
            {
                destinationPath = Path.Combine(Environment.CurrentDirectory, destinationPath);
            }

            if (!Directory.Exists(Path.GetDirectoryName(destinationPath)))
            {
                return Error($"{Name}. Invalid input arguments. Folder from parameter \"destinationPath\" (\"{destinationPath}\") cannot be found.");
            }

            Console.WriteLine($"{Name}: neutralResourcePath=\"{neutralResourcePath}\", destinationPath=\"{destinationPath}\" type=\"{settings.Type}\", neutralLanguage=\"{settings.NeutralLanguage}\".");
            
            LocalizatorResourceManager.Generate(settings);

            Console.WriteLine($"{Name}. Complete at {DateTime.Now:dd-MM-yyyy HH:mm:ss}.");

            return 0;
        }

        private static int GenerateEnumProvider(string[] args)
        {
            string solutionPath = args[0]?.Trim().Replace("\\\\", "\\");
            if (string.IsNullOrWhiteSpace(solutionPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"solutionPath\" not specified.");
            }

            if (!Directory.Exists(solutionPath))
            {
                return Error($"{Name}. Invalid input arguments. Directory from parameter \"solutionPath\" (\"{solutionPath}\") cannot be found.");
            }
            
            string projectPath = args[1]?.Trim().Replace("\\\\", "\\");
            if (string.IsNullOrWhiteSpace(projectPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"projectPath\" not specified.");
            }

            if (projectPath.StartsWith("/"))
            {
                projectPath = Path.Combine(Environment.CurrentDirectory, projectPath);
            }

            if (!File.Exists(projectPath))
            {
                return Error($"{Name}. Invalid input arguments. File from parameter \"projectPath\" (\"{projectPath}\") cannot be found.");
            }

            string destinationPath = args[2]?.Trim().Replace("\\\\", "\\");
            if (string.IsNullOrWhiteSpace(destinationPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"destinationPath\" not specified.");
            }

            if (destinationPath.StartsWith("/"))
            {
                destinationPath = Path.Combine(Environment.CurrentDirectory, destinationPath);
            }

            if (!Directory.Exists(Path.GetDirectoryName(destinationPath)))
            {
                return Error($"{Name}. Invalid input arguments. Folder from parameter \"destinationPath\" (\"{destinationPath}\") cannot be found.");
            }

            string[] exclude = ((args.Length >= 4) && (!string.IsNullOrWhiteSpace(args[3])))
                ? args[2]
                    .Split(new[] {",", ";"}, StringSplitOptions.RemoveEmptyEntries)
                    .Select(item => item.Trim())
                    .ToArray()
                : null;

            Console.WriteLine($"{Name}: projectPath=\"{projectPath}\", destinationPath=\"{destinationPath}\" exclude=\"{string.Join("; ", (exclude ?? new string[0]))}\".");

            EnumProviderManager.Generate(solutionPath, projectPath, destinationPath);

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

        private static string ProcessEnvVariables(string data)
        {
            data = data.Replace("$(ProjectDir)", "$(PWD)");
            IDictionary variables = Environment.GetEnvironmentVariables();
            foreach (DictionaryEntry keyValue in variables)
            {
                string key = $"$({keyValue.Key as string})";
                if (data.Contains(key))
                {
                    string value = (keyValue.Value as string) ?? string.Empty;
                    data = data.Replace(key, value);
                }
            }

            return data;
        }

        static int Main(string[] args)
        {
            // <Exec Command="dotnet run --project &quot;$(ProjectDir)../Renta.Tools.CodeGenerator/Renta.Tools.CodeGenerator.csproj&quot; &quot;$(ProjectDir)SharedResources.resx&quot; &quot;$(ProjectDir)../Renta.Tools.WebUI.Resources/SharedResources.cs&quot; 1 fi" />
            // <Exec Command="dotnet run --project &quot;$(ProjectDir)../Renta.Tools.CodeGenerator/Renta.Tools.CodeGenerator.csproj&quot; &quot;$(ProjectDir)SharedResources.resx&quot; &quot;$(ProjectDir)../Renta.Tools.WebUI/src/localization/Localizer.ts&quot; 0 fi" />
            
            try
            {
                if ((args == null) || (args.Length == 0))
                {
                    return Error($"{Name}. Invalid input arguments. Expected: \"neutralResourcePath\", \"destinationPath\", \"neutralLanguage\" (\"fi\" by default)\".");
                }

                if (!string.IsNullOrWhiteSpace(args[0]) && (args[0].EndsWith(".json", StringComparison.InvariantCultureIgnoreCase)))
                {
                    if (!File.Exists(args[0]))
                    {
                        return Error($"{Name}. Invalid input arguments. Setting file (\"{args[0]}\") cannot be found.");
                    }
                    
                    Console.WriteLine($"{Name}. Fetching settings from \"{args[0]}\".");

                    string json = File.ReadAllText(args[0]);

                    json = ProcessEnvVariables(json);
                    
                    var settings = JsonConvert.DeserializeObject<Settings>(json);

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