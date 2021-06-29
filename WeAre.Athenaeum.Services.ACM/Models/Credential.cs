using System;
using WeAre.Athenaeum.Services.ACM.Interface;

namespace WeAre.Athenaeum.Services.ACM.Models
{
    public sealed class Credential : ICredential, ICloneable
    {
        private CredentialKey _key;

        private static byte[] CopyArray(byte[] from)
        {
            if (from == null)
            {
                return null;
            }
            int length = from.Length;
            if (length == 0)
            {
                return new byte[0];
            }
            var to = new byte[length];
            Buffer.BlockCopy(from, 0, to, 0, length);
            return to;
        }

        public Credential()
        {
            _key = new CredentialKey();
        }

        public Credential(ICredential credential)
        {
            Assign(credential);
        }

        public Credential(CredentialKey key)
        {
            if (key == null)
                throw new ArgumentNullException(nameof(key));

            _key = key;
        }

        public void Assign(ICredential credential)
        {
            if (credential == null)
                throw new ArgumentNullException(nameof(credential));

            _key = new CredentialKey(credential.Key);
            Value = credential.Value;
        }

        public object Clone()
        {
            return new Credential(this);
        }

        public bool IsKeyMatch(ICredentialKey key)
        {
            return (_key.Equals(key));
        }

        /// <summary>
        /// Compares ContractId and SecurityDomain of the credentials. Returns true if equal.
        /// </summary>
        public bool IsKeyMatch(string securityDomain = null, string contractId = null)
        {
            return _key.Match(securityDomain, contractId);
        }

        #region Properties

        /// <summary>
        /// Key of the credential.
        /// </summary>
        public CredentialKey Key
        {
            get { return _key; }
            private set { _key = value; }
        }

        ICredentialKey ICredential.Key
        {
            get { return _key; }
        }
        
        /// <summary>
        /// Password of the credential. If credential's file part contains a private key requiring a passphrase, contains the passphrase. Not required, if File property is set.
        /// </summary>
        public string Value { get; set; }
        
        #endregion
    }
}