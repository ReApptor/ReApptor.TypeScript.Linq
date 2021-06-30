namespace WeAre.Athenaeum.Common.Interfaces.ACM
{
    public interface ICredentialKey
    {
        /// <summary>
        /// Label, or a name, of a credential. Required.
        /// </summary>
        /// <remarks>
        /// Notice, that label alone does not constitue a "primary key" of a credential. 
        /// Other credentials may share the same label, as long as path is different.
        /// </remarks>
        string Label { get; set; }

        /// <summary>
        /// Security domain of the credential. For example vaultId/itemId
        /// </summary>
        string Path { get; set; }

        /// <summary>
        /// Compares credential path and credentials label. Returns true if equal.
        /// </summary>
        bool Match(string path, string label);
    }
}