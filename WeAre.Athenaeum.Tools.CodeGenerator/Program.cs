using System;
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
            Console.WriteLine($"{Name}: neutralResourcePath=\"{settings.NeutralResourcePath}\", destinationPath=\"{settings.DestinationPath}\" type=\"{settings.Type}\", neutralLanguage=\"{settings.NeutralLanguage}\".");
            
            LocalizatorResourceManager.Generate(settings);

            Console.WriteLine($"{Name}. Complete at {DateTime.Now:dd-MM-yyyy HH:mm:ss}.");

            return 0;
        }
        
        private static int GenerateEnumProvider(EnumProviderSettings settings)
        {
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