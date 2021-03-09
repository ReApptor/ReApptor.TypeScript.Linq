namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public sealed class EnumProviderSettings
    {
        public string SolutionPath { get; set; }
        
        public string ProjectPath { get; set; }
        
        public string DestinationPath { get; set; }
        
        public string[] Exclude { get; set; }

        public string EnumsImport { get; set; }
        
        public string SelectListItemImport { get; set; }
    }
}