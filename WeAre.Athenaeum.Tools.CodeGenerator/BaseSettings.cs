namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public abstract class BaseSettings
    {
        public string CurrentDirectory { get; set; }
        
        public string SolutionDirectory { get; set; }
        
        public string ProjectDirectory { get; set; }
        
        public string TargetPath { get; set; }
    }
}