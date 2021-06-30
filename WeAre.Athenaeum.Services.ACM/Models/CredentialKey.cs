using System;
using WeAre.Athenaeum.Common.Interfaces.ACM;

namespace WeAre.Athenaeum.Services.ACM.Models
{
    public sealed class CredentialKey : ICredentialKey, ICloneable
    {
        private string _label;

        public CredentialKey()
        {
        }

        public CredentialKey(ICredentialKey key)
        {
            Assign(key);
        }

        public void Assign(ICredentialKey key)
        {
            if (key == null)
                throw new ArgumentNullException(nameof(key));

            Label = key.Label;
            Path = key.Path;
        }

        public object Clone()
        {
            return new CredentialKey(this);
        }

        public bool Match(string path, string label)
        {
            bool match = (path == null) ||
                         (path.Equals(Path ?? string.Empty, StringComparison.CurrentCultureIgnoreCase));
            match &= (label == null) ||
                     (label.Equals(Label ?? string.Empty, StringComparison.CurrentCultureIgnoreCase));
            return match;
        }
        
        /// <summary>
        /// Compares to Label and Path. Returns true if equal.
        /// </summary>
        public bool Equals(ICredentialKey key)
        {
            if (ReferenceEquals(key, null))
            {
                return false;
            }
            if (ReferenceEquals(this, key))
            {
                return true;
            }
            
            return Match(key.Path, key.Label);
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as ICredentialKey);
        }

        public override int GetHashCode()
        {
            string label = Label ?? string.Empty;
            string path = Path ?? string.Empty;
            string dump = $"Label:{label}.Path:{path}";
            return dump.GetHashCode();
        }

        #region 

        /// <summary>
        /// Label, or a name, of a credential. Required.
        /// </summary>
        /// <remarks>
        /// Notice, that label alone does not constitue a "primary key" of a credential. 
        /// Other credentials may share the same label, as long as Path is different.
        /// </remarks>
        public string Label
        {
            get { return _label; }
            set
            {
                if (value == null)
                    throw new ArgumentNullException(nameof(value), "Unique identifier (Label) cannot be null.");
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentOutOfRangeException(nameof(value), "Unique identifier cannot be empty or whitespace.");

                _label = value;
            }
        }

        /// <summary>
        /// Security domain of the credential. For example vaultId/itemId
        /// </summary>
        public string Path { get; set; }
        
        #endregion

        #region Static

        public static bool operator ==(CredentialKey x, ICredentialKey y)
        {
            if (ReferenceEquals(x, y))
            {
                return true;
            }
            if (ReferenceEquals(x, null))
            {
                return false;
            }
            return x.Equals(y);
        }

        public static bool operator !=(CredentialKey x, ICredentialKey y)
        {
            return !(x == y);
        }

        public static bool operator ==(CredentialKey x, CredentialKey y)
        {
            if (ReferenceEquals(x, y))
            {
                return true;
            }
            if (ReferenceEquals(x, null))
            {
                return false;
            }
            return x.Equals(y);
        }

        public static bool operator !=(CredentialKey x, CredentialKey y)
        {
            return (x != (ICredentialKey)y);
        }

        #endregion
    }
}