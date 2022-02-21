namespace WeAre.ReApptor.Common.Interfaces.ACM
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
        /// Compares two credential references or credential path and credential key. Returns true if equal.
        /// </summary>
        bool IsKeyMatch(ICredentialKey key);

        /// <summary>
        /// Compares credential path and credential key. Returns true if equal.
        /// </summary>
        bool IsKeyMatch(string path, string label);
    }
}