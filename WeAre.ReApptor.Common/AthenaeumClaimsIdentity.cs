using System.Collections.Generic;
using System.Security.Claims;
using WeAre.ReApptor.Common.Extensions;

namespace WeAre.ReApptor.Common
{
    public class AthenaeumClaimsIdentity : ClaimsIdentity
    {
        public AthenaeumClaimsIdentity()
            : base(AthenaeumConstants.AuthenticationType)
        {
        }
        
        public AthenaeumClaimsIdentity(string authenticationType)
            : base(authenticationType)
        {
        }

        /// <summary>Initializes a new instance of the <see cref="T:System.Security.Claims.ClaimsIdentity"></see> class using an enumerated collection of <see cref="T:System.Security.Claims.Claim"></see> objects.</summary>
        /// <param name="claims">The claims with which to populate the claims identity.</param>
        public AthenaeumClaimsIdentity(IEnumerable<Claim> claims)
            : base(claims, AthenaeumConstants.AuthenticationType)
        {
        }

        /// <summary>
        /// Initializes an instance of <see cref="ClaimsIdentity"/>.
        /// </summary>
        /// <param name="claims"><see cref="IEnumerable{Claim}"/> associated with this instance.</param>
        /// <param name="authenticationType">The authentication method used to establish this identity.</param>
        public AthenaeumClaimsIdentity(IEnumerable<Claim> claims, string authenticationType)
            : base(claims, authenticationType)
        {
        }

        public override bool IsAuthenticated
        {
            get { return (!string.IsNullOrWhiteSpace(Username)); }
        }

        public string Username
        {
            get { return this.NameIdentifier(); }
        }
    }
}