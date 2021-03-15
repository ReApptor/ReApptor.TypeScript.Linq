using System.IO;

namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public abstract class BaseSettings
    {
        protected string RequirePath(string parameter, string path, bool directory, bool shouldExist = true, bool sourceFolderShouldExist = true)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                return $"Invalid input arguments. Parameter \"{parameter}\" not specified.";
            }

            if (shouldExist)
            {
                bool exists = (directory) ? Directory.Exists(path) : File.Exists(path);
                if (!exists)
                {
                    return (directory)
                        ? $"Invalid input arguments. File from parameter \"{parameter}\" (\"{path}\") cannot be found."
                        : $"Invalid input arguments. Directory from parameter \"{parameter}\" (\"{path}\") cannot be found.";
                }
            }
            else if ((!directory) && (sourceFolderShouldExist))
            {
                bool exists = Directory.Exists(SettingsProvider.GetDirectoryName(path));
                if (!exists)
                {
                    return $"Invalid input arguments. Source directory from parameter \"{parameter}\" (\"{path}\") cannot be found.";
                }
            }

            return null;
        }
        
        public abstract string Validate();
        
        public string CurrentDir { get; set; }
        
        public string SolutionDir { get; set; }
        
        public string ProjectDir { get; set; }
        
        public string TargetPath { get; set; }
    }
}