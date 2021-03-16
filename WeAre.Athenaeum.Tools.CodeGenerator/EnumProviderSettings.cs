namespace WeAre.Athenaeum.Tools.CodeGenerator
{
    public sealed class EnumProviderSettings : BaseSettings
    {
        public string DestinationPath  { get; set; }
        
        public string[] Exclude { get; set; }

        public string EnumsImport { get; set; }
        
        public string SelectListItemImport { get; set; }
        
        public override string Validate()
        {
            return RequirePath(nameof(TargetPath), TargetPath, false) ??
                   RequirePath(nameof(DestinationPath), DestinationPath, false, false);
        }
    }
}