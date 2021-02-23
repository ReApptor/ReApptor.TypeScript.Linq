namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public sealed class LocalizatorResourceSettings
    {
        public LocalizatorResourceManager.Type Type { get; set; }
        
        public string NeutralLanguage { get; set; }
        
        public string NeutralResourcePath { get; set; }
        
        public string DestinationPath  { get; set; }
        
        public string Namespace { get; set; }
        
        public string Import { get; set; }

        public string ClassName { get; set; }
        
        public string BaseClassName { get; set; }
    }
}