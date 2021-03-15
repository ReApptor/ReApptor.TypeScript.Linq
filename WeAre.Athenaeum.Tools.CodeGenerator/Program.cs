using System;
using System.IO;
using System.Linq;

namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public class Program
    {
        public const string Name = SettingsProvider.Name;
        
        private static int Error(string message)
        {
            Console.ForegroundColor = ConsoleColor.DarkRed;
            Console.WriteLine(message);
            return -1;
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

            string destinationFolder = SettingsProvider.GetDirectoryName(settings.DestinationPath);
            if ((!settings.SplitByComponent) && (!Directory.Exists(destinationFolder)))
            {
                return Error($"{Name}. Invalid input arguments. Folder from parameter \"destinationPath\" (\"{settings.DestinationPath}\") cannot be found.");
            }

            Console.WriteLine($"{Name}: neutralResourcePath=\"{settings.NeutralResourcePath}\", destinationPath=\"{settings.DestinationPath}\" type=\"{settings.Type}\", neutralLanguage=\"{settings.NeutralLanguage}\".");
            
            LocalizatorResourceManager.Generate(settings);

            Console.WriteLine($"{Name}. Complete at {DateTime.Now:dd-MM-yyyy HH:mm:ss}.");

            return 0;
        }
        
        private static int GenerateEnumProvider(EnumProviderSettings settings)
        {
            if (string.IsNullOrWhiteSpace(settings.SolutionDirectory))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"solutionPath\" not specified.");
            }

            if (!Directory.Exists(settings.SolutionDirectory))
            {
                return Error($"{Name}. Invalid input arguments. Directory from parameter \"solutionPath\" (\"{settings.SolutionDirectory}\") cannot be found.");
            }
            
            if (string.IsNullOrWhiteSpace(settings.ProjectDirectory))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"projectPath\" not specified.");
            }

            if (settings.TargetPath.StartsWith("/"))
            {
                settings.TargetPath = Path.Combine(Environment.CurrentDirectory, settings.TargetPath);
            }

            if (!File.Exists(settings.TargetPath))
            {
                return Error($"{Name}. Invalid input arguments. File from parameter \"targetPath\" (\"{settings.TargetPath}\") cannot be found.");
            }

            if (string.IsNullOrWhiteSpace(settings.DestinationPath))
            {
                return Error($"{Name}. Invalid input arguments. Parameter \"destinationPath\" not specified.");
            }

            if (settings.DestinationPath.StartsWith("/"))
            {
                settings.DestinationPath = Path.Combine(Environment.CurrentDirectory, settings.DestinationPath);
            }

            string destinationFolder = SettingsProvider.GetDirectoryName(settings.DestinationPath);
            if (!Directory.Exists(destinationFolder))
            {
                return Error($"{Name}. Invalid input arguments. Folder from parameter \"destinationPath\" (\"{settings.DestinationPath}\") cannot be found.");
            }

            Console.WriteLine($"{Name}: targetPath=\"{settings.TargetPath}\", destinationPath=\"{settings.DestinationPath}\" exclude=\"{string.Join("; ", (settings.Exclude ?? new string[0]))}\" enumsImport=\"{settings.EnumsImport}\" selectListItemImport=\"{settings.SelectListItemImport}\".");

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

            EnumProviderSettings[] enumProviders = settings
                .EnumProvider?
                .Where(item => item != null)
                .ToArray();

            if (enumProviders != null)
            {
                foreach (EnumProviderSettings enumProvider in enumProviders)
                {
                    int result = GenerateEnumProvider(enumProvider);
                    
                    if (result != 0)
                    {
                        return result;
                    }
                }
            }

            return 0;
        }

        public static int Main(string[] args)
        {
            // <Exec Command="dotnet run --project &quot;$(ProjectDir)../Renta.Tools.CodeGenerator/Renta.Tools.CodeGenerator.csproj&quot; &quot;$(ProjectDir)SharedResources.resx&quot; &quot;$(ProjectDir)../Renta.Tools.WebUI.Resources/SharedResources.cs&quot; 1 fi" />
            // <Exec Command="dotnet run --project &quot;$(ProjectDir)../Renta.Tools.CodeGenerator/Renta.Tools.CodeGenerator.csproj&quot; &quot;$(ProjectDir)SharedResources.resx&quot; &quot;$(ProjectDir)../Renta.Tools.WebUI/src/localization/Localizer.ts&quot; 0 fi" />

            try
            {
                var settingsProvider = new SettingsProvider(args);
                
                if (settingsProvider.Debug)
                {
                    Console.WriteLine($"{Name}. Environment.CurrentDirectory=\"{Environment.CurrentDirectory}\".");
                    Console.WriteLine($"{Name}. CurrentDir=\"{settingsProvider.CurrentDir}\".");
                    Console.WriteLine($"{Name}. SolutionDir=\"{settingsProvider.SolutionDir}\".");
                    Console.WriteLine($"{Name}. ProjectDir=\"{settingsProvider.ProjectDir}\".");
                    Console.WriteLine($"{Name}. TargetPath=\"{settingsProvider.TargetPath}\".");
                    Console.WriteLine($"{Name}. SettingFilePath=\"{settingsProvider.SettingFilePath}\".");
                
                    foreach (string arg in args ?? new string[0])
                    {
                        Console.WriteLine($"{Name}. ARG. value=\"{arg}\"");
                    }
                }

                if (settingsProvider.Failed)
                {
                    return Error(settingsProvider.Error);
                }

                return Generate(settingsProvider.Settings);
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