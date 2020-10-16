using System;
using System.IO;

namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    class Program
    {
        static int Main(string[] args)
        {
            try
            {
                if ((args == null) || (args.Length < 2))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine("Renta.Tools.CodeGenerator. Invalid input arguments. Expected: \"neutralResourcePath\", \"destinationPath\", \"neutralLanguage\" (\"fi\" by default)\".");
                    return -1;
                }

                string neutralResourcePath = args[0]?.Trim().Replace("\\\\", "\\");
                if (string.IsNullOrWhiteSpace(neutralResourcePath))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine("Renta.Tools.CodeGenerator. Invalid input arguments. Parameter \"neutralResourcePath\"not specified.");
                    return -1;
                }
                if (neutralResourcePath.StartsWith("/"))
                {
                    neutralResourcePath = Path.Combine(Environment.CurrentDirectory, neutralResourcePath);
                }
                if (!File.Exists(neutralResourcePath))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine($"Renta.Tools.CodeGenerator. Invalid input arguments. File from parameter \"neutralResourcePath\" (\"{neutralResourcePath}\") cannot be found.");
                    return -1;
                }

                string destinationPath = args[1]?.Trim().Replace("\\\\", "\\");
                if (string.IsNullOrWhiteSpace(destinationPath))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine("Renta.Tools.CodeGenerator. Invalid input arguments. Parameter \"destinationPath\"not specified.");
                    return -1;
                }
                if (destinationPath.StartsWith("/"))
                {
                    destinationPath = Path.Combine(Environment.CurrentDirectory, destinationPath);
                }
                if (!Directory.Exists(Path.GetDirectoryName(destinationPath)))
                {
                    Console.ForegroundColor = ConsoleColor.DarkRed;
                    Console.WriteLine($"Renta.Tools.CodeGenerator. Invalid input arguments. Folder from parameter \"destinationPath\" (\"{neutralResourcePath}\") cannot be found.");
                    return -1;
                }

                LocalizatorResourceManager.Type type = ((args.Length > 2) && (!string.IsNullOrWhiteSpace(args[2])) && (args[2].Trim() == "1"))
                    ? LocalizatorResourceManager.Type.CSharp
                    : LocalizatorResourceManager.Type.TypeScript;

                string neutralLanguage = ((args.Length > 3) && (!string.IsNullOrWhiteSpace(args[3])))
                    ? args[3].Trim()
                    : "fi";

                Console.WriteLine($"Renta.Tools.CodeGenerator: neutralResourcePath=\"{neutralResourcePath}\", destinationPath=\"{destinationPath}\" type=\"{type}\", neutralLanguage=\"{neutralLanguage}\".");

                LocalizatorResourceManager.Generate(neutralResourcePath, destinationPath, type, neutralLanguage);

                Console.WriteLine($"Renta.Tools.CodeGenerator. Complete at {DateTime.Now:dd-MM-yyyy HH:mm:ss}.");

                return 0;
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.DarkRed;
                Console.WriteLine("Renta.Tools.CodeGenerator. Exception occured.");
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