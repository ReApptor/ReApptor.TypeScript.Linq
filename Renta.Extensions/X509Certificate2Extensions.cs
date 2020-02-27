using System;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace Renta.Extensions
{
    public static class X509Certificate2Extensions
    {
        public static bool IsExportable(this X509Certificate2 certificate)
        {
            if (certificate == null)
                throw new ArgumentNullException(nameof(certificate));

            if (!certificate.HasPrivateKey)
            {
                return true;
            }
            var serviceProvider = (RSACryptoServiceProvider)certificate.PrivateKey;
            return serviceProvider.CspKeyContainerInfo.Exportable;
        }
    }
}