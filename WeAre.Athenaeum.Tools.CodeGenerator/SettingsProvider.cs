using System;
using System.Collections;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public sealed class SettingsProvider
    {
        private static string GetEnvironmentVariable(params string[] names)
        {
            names ??= new string[0];
            foreach (string name in names)
            {
                if (!string.IsNullOrWhiteSpace(name))
                {
                    string variable = Environment.GetEnvironmentVariable(name);
                    if ((!string.IsNullOrWhiteSpace(variable)) && (variable != EmptyEnvironmentVariable))
                    {
                        return variable.Trim();
                    }
                }
            }

            return null;
        }

        private static string GetProjectDir(string currentDir)
        {
            string projectDirectory = GetEnvironmentVariable("$ProjectDir", "$(ProjectDir)", "ProjectDir", ProjectDirectoryEnvironmentVariable);
            return (!string.IsNullOrWhiteSpace(projectDirectory))
                ? projectDirectory
                : currentDir;
        }

        private static string GetTargetPath()
        {
            return GetEnvironmentVariable("$TargetPath", "$(TargetPath)", "TargetPath");
        }

        private static string GetSolutionDir(string projectDirectory)
        {
            string solutionDirectory = GetEnvironmentVariable("$SolutionDir", "$(SolutionDir)", "SolutionDir");
            return (!string.IsNullOrWhiteSpace(solutionDirectory))
                ? solutionDirectory
                : GetDirectoryName(projectDirectory);
        }

        private static string TrimPath(string path, bool directory = false)
        {
            if (!string.IsNullOrWhiteSpace(path))
            {
                if (directory)
                {
                    path += Path.DirectorySeparatorChar;
                }

                while (path.Contains("\\\\"))
                {
                    path = path.Replace("\\\\", "\\");
                }

                while (path.Contains("//"))
                {
                    path = path.Replace("//", "/");
                }

                return path;
            }
            
            return null;
        }
        
        private Settings ProcessSettings(string path)
        {
            if (Debug)
            {
                Console.WriteLine($"{Name}. Fetching settings from \"{path}\".");
            }

            string json = File.ReadAllText(path);

            json = ProcessEnvVariables(json);
                    
            var settings = JsonConvert.DeserializeObject<Settings>(json);

            return settings;
        }

        private string PathCombine(string x, string y, bool directory = false)
        {
            if (string.IsNullOrWhiteSpace(x))
            {
                return y;
            }

            if (string.IsNullOrWhiteSpace(x))
            {
                return y;
            }
            
            return TrimPath($"{x}{Path.DirectorySeparatorChar}{y}", directory);
        }

        private string GetPath(string path, bool directory, params string[] folders)
        {
            path = TrimPath(path, directory);

            bool exists = (directory) ? Directory.Exists(path) : File.Exists(path);
            
            if (!exists)
            {
                foreach (string folder in folders)
                {
                    if (!string.IsNullOrWhiteSpace(folder))
                    {
                        string absolutePath = PathCombine(folder, path, directory);
                        exists = (directory) ? Directory.Exists(absolutePath) : File.Exists(absolutePath);
                        if (exists)
                        {
                            return absolutePath;
                        }
                    }
                }
            }

            return path;
        }

        private string GetPath(string path, bool directory = false)
        {
            return (!string.IsNullOrWhiteSpace(path))
                ? GetPath(path, directory, CurrentDir, ProjectDir, SolutionDir)
                : null;
        }

        private void ProcessSettings()
        {
            SettingFilePath = Args.FirstOrDefault(arg => arg.EndsWith(SettingsFileName, StringComparison.InvariantCultureIgnoreCase));

            SettingFilePath ??= $"{Path.DirectorySeparatorChar}{SettingsFileName}";

            SettingFilePath = GetPath(SettingFilePath);

            if (!File.Exists(SettingFilePath))
            {
                Error = $"{Name}. Invalid input arguments. Setting file \"{SettingFilePath}\" cannot be found.";
                return;
            }

            Settings = ProcessSettings(SettingFilePath);
        }

        private string ProcessEnvVariables(string data)
        {
            //List of IDE variables: https://docs.microsoft.com/en-us/cpp/build/reference/common-macros-for-build-commands-and-properties?view=msvc-160
            //Exec command description: https://docs.microsoft.com/en-us/visualstudio/msbuild/exec-task?view=vs-2019
            data = data.Replace("$(ProjectDir)", ProjectDir);
            data = data.Replace(ProjectDirectoryEnvironmentVariable, ProjectDir);
            data = data.Replace("$(SolutionDir)", SolutionDir);
            if (!string.IsNullOrWhiteSpace(TargetPath))
            {
                data = data.Replace("$(TargetPath)", TargetPath);
            }
            IDictionary variables = Environment.GetEnvironmentVariables();
            foreach (DictionaryEntry keyValue in variables)
            {
                if (Debug)
                {
                    Console.WriteLine($"{Name}. ENV. key=\"{keyValue.Key}\" value=\"{keyValue.Value}\"");
                }
                string key = $"$({keyValue.Key as string})";
                if ((key != ProjectDirectoryEnvironmentVariable) && (data.Contains(key)))
                {
                    string value = (keyValue.Value as string) ?? string.Empty;
                    data = data.Replace(key, value);
                }
            }

            return data;
        }

        private void Process(string[] args)
        {
            Args = (args ?? new string[0])
                .Where(arg => !string.IsNullOrWhiteSpace(arg))
                .Select(arg => arg.Trim())
                .ToArray();
            
            Debug = ((Args.Length > 0) && (Args.Any(arg => string.Equals("DEBUG", arg, StringComparison.InvariantCultureIgnoreCase))));

            CurrentDir = TrimPath(Environment.CurrentDirectory, true);
            
            ProjectDir = GetPath(GetProjectDir(CurrentDir), true);
            
            SolutionDir = GetPath(GetSolutionDir(ProjectDir), true);
            
            TargetPath = GetPath(GetTargetPath());

            ProcessSettings();
        }

        public SettingsProvider(string[] args)
        {
            Process(args);
        }

        public string[] Args { get; private set; }
        
        public string CurrentDir { get; private set; }
        
        public string SolutionDir { get; private set; }
        
        public string ProjectDir { get; private set; }
        
        public string TargetPath { get; private set; }
        
        public string SettingFilePath { get; private set; }
        
        public bool Debug { get; private set; }
        
        public Settings Settings { get; private set; }
        
        public string Error { get; private set; }

        public bool Failed => (!string.IsNullOrWhiteSpace(Error));

        #region Constants
        
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

        /// <summary>
        /// "*Undefined*"
        /// </summary>
        public const string EmptyEnvironmentVariable = "*Undefined*";

        #endregion
        
        #region Static

        public static string GetDirectoryName(string path)
        {
            path = path.TrimEnd('\\', '/');
            return Path.GetDirectoryName(path);
        }
        
        #endregion
    }
}