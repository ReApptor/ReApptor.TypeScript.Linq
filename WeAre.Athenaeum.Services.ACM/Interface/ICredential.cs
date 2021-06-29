namespace WeAre.Athenaeum.Services.ACM.Interface
{
    public interface ICredential
    {
        /// <summary>
        /// Key of the credential.
        /// </summary>
        ICredentialKey Key { get; }
        
        /// <summary>
        /// Value of the credential.
        /// </summary>
        string Value { get; }
        
        /// <summary>
        /// Compares Label, ContractId and SecurityDomain of the credentials. Returns true if equal.
        /// </summary>
        bool IsKeyMatch(ICredentialKey key);

        /// <summary>
        /// Compares ContractId and SecurityDomain of the credentials. Returns true if equal.
        /// Not specified (null) arguments always match.
        /// In case if securityDomain and contract id is null, result always true.
        /// </summary>
        bool IsKeyMatch(string securityDomain = null, string contractId = null);
    }
}