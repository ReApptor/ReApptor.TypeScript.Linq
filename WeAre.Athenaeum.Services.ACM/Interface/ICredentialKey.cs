namespace WeAre.Athenaeum.Services.ACM.Interface
{
    public interface ICredentialKey
    { 
        /// <summary>
        /// Label, or a name, of a credential. Required.
        /// </summary>
        /// <remarks>
        /// Notice, that label alone does not constitue a "primary key" of a credential. 
        /// Other credentials may share the same label, as long as either or both ContractId and SecurityDomain are different.
        /// </remarks>
        string Label { get; set; }

        /// <summary>
        /// Security domain of the credential. For example ftp://files.acme.com, https://shs.skatteverket.se or teasp1.local. Not required.
        /// </summary>
        /// <remarks>
        /// Security domain may or may not contain the security protocol as well. 
        /// Security domains containing and not containing the protocol are considered different, 
        /// for example ftp://files.acme.com and files.acme.com are different security domains.
        /// </remarks>
        string Path { get; set; }

        /// <summary>
        /// Compares ContractId and SecurityDomain of the credentials. Returns true if equal.
        /// Not specified (null) arguments always match.
        /// In case if securityDomain and contract id is null, result always true.
        /// </summary>
        bool Match(string path, string label);
    }
}