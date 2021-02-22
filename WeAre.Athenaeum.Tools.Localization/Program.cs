using System;
using System.IO;
using WeAre.Athenaeum.Tools.CodeGenerator;

namespace WeAre.Athenaeum.Tools.Localization
{
    public class Program
    {
        static int Main(string[] args)
        {
            try
            {
                if ((args == null) || (args.Length < 2))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine(@"WeAre.Athenaeum.Tools.Localization. Invalid input arguments. Expected: ""neutralResourcePath"", ""destinationPath"", ""neutralLanguage"" (""fi"" by default)"".");
                    return -1;
                }

                string neutralResourcePath = args[0]?.Trim().Replace("\\\\", "\\");
                if (string.IsNullOrWhiteSpace(neutralResourcePath))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine(@"WeAre.Athenaeum.Tools.Localization. Invalid input arguments. Parameter ""neutralResourcePath""not specified.");
                    return -1;
                }
                if (neutralResourcePath.StartsWith("/"))
                {
                    neutralResourcePath = Path.Combine(Environment.CurrentDirectory, neutralResourcePath);
                }
                if (!File.Exists(neutralResourcePath))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine($@"WeAre.Athenaeum.Tools.Localization. Invalid input arguments. File from parameter ""neutralResourcePath"" (""{neutralResourcePath}"") cannot be found.");
                    return -1;
                }

                string destinationPath = args[1]?.Trim().Replace("\\\\", "\\");
                if (string.IsNullOrWhiteSpace(destinationPath))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine(@"WeAre.Athenaeum.Tools.Localization. Invalid input arguments. Parameter ""destinationPath""not specified.");
                    return -1;
                }
                if (destinationPath.StartsWith("/"))
                {
                    destinationPath = Path.Combine(Environment.CurrentDirectory, destinationPath);
                }
                if (!Directory.Exists(Path.GetDirectoryName(destinationPath)))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine($@"WeAre.Athenaeum.Tools.Localization. Invalid input arguments. Folder from parameter ""destinationPath"" (""{neutralResourcePath}"") cannot be found.");
                    return -1;
                }

                LocalizatorResourceManager.Type type = ((args.Length > 2) && (!string.IsNullOrWhiteSpace(args[2])) && (args[2].Trim() == "1"))
                    ? LocalizatorResourceManager.Type.CSharp
                    : LocalizatorResourceManager.Type.TypeScript;

                string neutralLanguage = ((args.Length > 3) && (!string.IsNullOrWhiteSpace(args[3])))
                    ? args[3].Trim()
                    : "fi";

                Console.WriteLine($@"WeAre.Athenaeum.Tools.Localization: neutralResourcePath=""{neutralResourcePath}"", destinationPath=""{destinationPath}"" type=""{type}"", neutralLanguage=""{neutralLanguage}"".");

                LocalizatorResourceManager.Generate(neutralResourcePath, destinationPath, type, neutralLanguage);

                Console.WriteLine($@"WeAre.Athenaeum.Tools.Localization. Complete at {DateTime.Now:dd-MM-yyyy HH:mm:ss}.");

                return 0;
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.DarkRed;
                Console.WriteLine(@"WeAre.Athenaeum.Tools.Localization. Exception occured.");
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