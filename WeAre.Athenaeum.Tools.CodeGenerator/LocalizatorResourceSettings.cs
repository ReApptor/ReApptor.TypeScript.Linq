namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public sealed class LocalizatorResourceSettings : BaseSettings
    {
        public const string ComponentNameTag = "$(COMPONENT_NAME)";
        
        public const string ComponentFullNameTag = "$(COMPONENT_FULL_NAME)";
        
        public LocalizatorResourceManager.Type Type { get; set; }
        
        public string NeutralLanguage { get; set; }
        
        public string NeutralResourcePath { get; set; }
        
        public string DestinationPath  { get; set; }
        
        public string Namespace { get; set; }
        
        public string Import { get; set; }
        
        public string BaseClassName { get; set; }
        
        public string[] Include { get; set; }
        
        public string[] Exclude { get; set; }

        public bool SplitByComponent
        {
            get { return (!string.IsNullOrWhiteSpace(DestinationPath)) && (DestinationPath.Contains(ComponentNameTag)); }
        }

        public override string Validate()
        {
            return RequirePath(nameof(NeutralResourcePath), NeutralResourcePath, false) ??
                   RequirePath(nameof(DestinationPath), DestinationPath, false, false, !SplitByComponent);
        }
    }
}