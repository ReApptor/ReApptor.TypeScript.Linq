using Microsoft.Extensions.Options;

namespace Renta.Apps.Common.Configuration.Settings
{
    public sealed class LoginSettings : IOptions<LoginSettings>
    {
        LoginSettings IOptions<LoginSettings>.Value => this;

        /// <summary>
        /// Lock-out timeout: 10 minutes by default
        /// </summary>
        public int LockoutTimeoutInMinutes { get; set; }

        /// <summary>
        /// Failed login attempts count: 5 attempts by default
        /// </summary>
        public int FailedCount { get; set; }
    }
}