using System.Collections.Generic;
using System.Security.Claims;
using Renta.Toolkit.Extensions;

namespace Renta.Toolkit
{
    public sealed class RentaClaimsIdentity : ClaimsIdentity
    {
        public RentaClaimsIdentity()
            : base(RentaConstants.AuthenticationType)
        {
        }

        /// <summary>Initializes a new instance of the <see cref="T:System.Security.Claims.ClaimsIdentity"></see> class using an enumerated collection of <see cref="T:System.Security.Claims.Claim"></see> objects.</summary>
        /// <param name="claims">The claims with which to populate the claims identity.</param>
        public RentaClaimsIdentity(IEnumerable<Claim> claims)
            : base(claims, RentaConstants.AuthenticationType)
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