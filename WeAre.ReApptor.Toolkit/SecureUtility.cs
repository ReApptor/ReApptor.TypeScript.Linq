using System;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using WeAre.ReApptor.Toolkit.Extensions;

namespace WeAre.ReApptor.Toolkit
{
    [SecuritySafeCritical]
    public static class SecureUtility
    {
        #region Private

        private static readonly object SecurityLock = new object();

        private static readonly SecureString PasswordPrefix = @"B99832A42BC54A279B97704787A60E1E".Convert();

        private static readonly SecureString AesPrefix = @"23A2E0897159434DB6EA3B959B77CF9A".Convert();

        private static readonly SecureString AesKey = "ZW79JCTVTVWIC/A2WHFDCPPKDABO5UO6CST4JMSTMKA=".Convert();

        private static readonly SecureString AesVector = "SYEMSOFNDXPD50DYM3S9PW==".Convert();

        private static SecureString Convert(this string password)
        {
            lock (SecurityLock)
            {
                var securePassword = new SecureString();
                foreach (char symbol in password)
                {
                    securePassword.AppendChar(symbol);
                }
                securePassword.MakeReadOnly();
                return securePassword;
            }
        }

        private static string GetString(this SecureString password)
        {
            lock (SecurityLock)
            {
                IntPtr ptr = IntPtr.Zero;
                try
                {
                    ptr = Marshal.SecureStringToGlobalAllocUnicode(password);
                    return Marshal.PtrToStringUni(ptr);
                }
                finally
                {
                    if (ptr != IntPtr.Zero)
                    {
                        Marshal.ZeroFreeGlobalAllocUnicode(ptr);
                    }
                }
            }
        }

        private static BigInteger GetBig(byte[] data)
        {
            byte[] inArr = (byte[])data.Clone();
            Array.Reverse(inArr);  // Reverse the byte order
            byte[] final = new byte[inArr.Length + 1];  // Add an empty byte at the end, to simulate unsigned BigInteger (no negatives!)
            Array.Copy(inArr, final, inArr.Length);

            return new BigInteger(final);
        }

        // Add 4 byte random padding, first bit *Always On*
        private static byte[] AddPadding(byte[] data)
        {
            var rnd = new Random();

            byte[] paddings = new byte[4];
            rnd.NextBytes(paddings);
            paddings[0] = (byte)(paddings[0] | 128);

            byte[] results = new byte[data.Length + 4];

            Array.Copy(paddings, results, 4);
            Array.Copy(data, 0, results, 4, data.Length);
            return results;
        }

        private static byte[] RemovePadding(byte[] data)
        {
            byte[] results = new byte[data.Length - 4];
            Array.Copy(data, results, results.Length);
            return results;
        }

        private static byte[] PrivateEncryption(this RSACryptoServiceProvider rsa, byte[] data)
        {
            int maxDataLength = (rsa.KeySize / 8) - 6;
            if (data.Length > maxDataLength)
                throw new ArgumentOutOfRangeException(nameof(data), $"Maximum data length for the current key size ({rsa.KeySize} bits) is {maxDataLength} bytes (current length: {data.Length} bytes)");

            // Add 4 byte padding to the data, and convert to BigInteger struct
            BigInteger numData = GetBig(AddPadding(data));

            RSAParameters rsaParams = rsa.ExportParameters(true);
            BigInteger d = GetBig(rsaParams.D);
            BigInteger modulus = GetBig(rsaParams.Modulus);
            BigInteger encData = BigInteger.ModPow(numData, d, modulus);

            return encData.ToByteArray();
        }

        private static byte[] PublicDecryption(this RSACryptoServiceProvider rsa, byte[] cipherData)
        {
            var numEncData = new BigInteger(cipherData);

            RSAParameters rsaParams = rsa.ExportParameters(false);
            BigInteger exponent = GetBig(rsaParams.Exponent);
            BigInteger modulus = GetBig(rsaParams.Modulus);

            BigInteger decData = BigInteger.ModPow(numEncData, exponent, modulus);

            byte[] data = decData.ToByteArray();
            byte[] result = new byte[data.Length - 1];
            Array.Copy(data, result, result.Length);
            result = RemovePadding(result);

            Array.Reverse(result);
            return result;
        }

        #endregion

        #region Public

        public static SecureString ToSecure(this string password)
        {
            if (password == null)
                throw new ArgumentNullException(nameof(password));
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentOutOfRangeException(nameof(password), "Password is null or empty");

            lock (SecurityLock)
            {
                SecureString securePassword = PasswordPrefix.Copy();
                foreach (char symbol in password)
                {
                    securePassword.AppendChar(symbol);
                }
                securePassword.MakeReadOnly();
                return securePassword;
            }
        }

        public static byte[] GetPasswordHash(this string password)
        {
            if (password == null)
                throw new ArgumentNullException(nameof(password));
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentOutOfRangeException(nameof(password), "Password is null or empty");

            SecureString secure = password.ToSecure();
            return secure.GetPasswordHash();
        }

        public static byte[] GetPasswordHash(this SecureString password)
        {
            if (password == null)
                throw new ArgumentNullException(nameof(password));

            string value = password.GetString();
            byte[] hashcode = value.Hash256();
            return hashcode;
        }

        #region Symmetric Encryption

        public static AesCryptoServiceProvider CreateAesProvider(SecureString keyInBase64, SecureString vectorInBase64)
        {
            if (keyInBase64 == null)
                throw new ArgumentNullException(nameof(keyInBase64));
            if (vectorInBase64 == null)
                throw new ArgumentNullException(nameof(vectorInBase64));

            return new AesCryptoServiceProvider
            {
                Key = System.Convert.FromBase64String(keyInBase64.GetString()),
                IV = System.Convert.FromBase64String(vectorInBase64.GetString())
            };
        }

        public static string Encrypt(this string value, SecureString key = null, SecureString vector = null, SecureString prefix = null)
        {
            if (string.IsNullOrEmpty(value))
                throw new ArgumentNullException(nameof(value));

            key ??= AesKey;
            vector ??= AesVector;
            prefix ??= AesPrefix;

            using var provider = CreateAesProvider(key, vector);
            using ICryptoTransform encryptor = provider.CreateEncryptor();
            using var msEncrypt = new MemoryStream();
            using var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
            using (var swEncrypt = new StreamWriter(csEncrypt))
            {
                //Write all data to the stream.
                swEncrypt.Write(prefix.GetString());
                swEncrypt.Write(value);
            }
            return System.Convert.ToBase64String(msEncrypt.ToArray());
        }

        public static SecureString Decrypt(this string value, SecureString key = null, SecureString vector = null, SecureString prefix = null)
        {
            if (string.IsNullOrEmpty(value))
                throw new ArgumentNullException(nameof(value));

            key ??= AesKey;
            vector ??= AesVector;
            prefix ??= AesPrefix;

            using var provider = CreateAesProvider(key, vector);
            using ICryptoTransform decryptor = provider.CreateDecryptor();
            byte[] dataBytes = System.Convert.FromBase64String(value);
            using var msDecrypt = new MemoryStream(dataBytes);
            using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
            using var srDecrypt = new StreamReader(csDecrypt);
            string result = srDecrypt.ReadToEnd();
            string prefixValue = prefix.GetString();
            if (result.StartsWith(prefixValue))
            {
                result = result.Substring(prefix.Length);
            }
            return result.ToSecure();
        }

        #endregion

        #region Asymmetric Encryption

        public static byte[] Encrypt(this byte[] data, X509Certificate2 certificate, bool usePrivateKey = false)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));
            if (certificate == null)
                throw new ArgumentNullException(nameof(certificate));

            RSACryptoServiceProvider serviceProvider;
            if (!usePrivateKey)
            {
                serviceProvider = (RSACryptoServiceProvider) certificate.PublicKey.Key;
                byte[] encryptedData = serviceProvider.Encrypt(data, false);
                return encryptedData;
            }

            if (!certificate.HasPrivateKey)
                throw new ArgumentOutOfRangeException(nameof(certificate), "Certificate does not contain a private key.");
            if (!certificate.IsExportable())
                throw new ArgumentOutOfRangeException(nameof(certificate), "Private key should be exportable to encrypt.");

            serviceProvider = (RSACryptoServiceProvider) certificate.PrivateKey;
            
            return PrivateEncryption(serviceProvider, data);
        }

        public static string Encrypt(this string value, X509Certificate2 certificate, bool usePrivateKey = false)
        {
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            byte[] data = Encoding.UTF8.GetBytes(value);
            byte[] encryptedData = Encrypt(data, certificate, usePrivateKey);
            string encryptedValue = System.Convert.ToBase64String(encryptedData);
            return encryptedValue;
        }

        public static byte[] Decrypt(this byte[] data, X509Certificate2 certificate, bool usePrivateKey = true)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));
            if (certificate == null)
                throw new ArgumentNullException(nameof(certificate));

            RSACryptoServiceProvider serviceProvider;
            if (usePrivateKey)
            {
                if (!certificate.HasPrivateKey)
                    throw new ArgumentOutOfRangeException(nameof(certificate), "Certificate does not contain a private key.");

                serviceProvider = (RSACryptoServiceProvider)certificate.PrivateKey;
                byte[] decryptedData = serviceProvider.Decrypt(data, false);
                return decryptedData;
            }

            serviceProvider = (RSACryptoServiceProvider)certificate.PublicKey.Key;
            return PublicDecryption(serviceProvider, data);
        }

        public static string Decrypt(this string encryptedDataAsBase64, X509Certificate2 certificate, bool usePrivateKey = true)
        {
            if (encryptedDataAsBase64 == null)
                throw new ArgumentNullException(nameof(encryptedDataAsBase64));

            byte[] encryptedData = System.Convert.FromBase64String(encryptedDataAsBase64);
            byte[] decryptedData = Decrypt(encryptedData, certificate, usePrivateKey);
            string decryptedText = Encoding.UTF8.GetString(decryptedData);
            return decryptedText;
        }

        #endregion

        #region Signing

        public static byte[] ComputeSignature(this byte[] data, X509Certificate2 cert)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));
            if (cert == null)
                throw new ArgumentNullException(nameof(cert));
            if (!cert.HasPrivateKey)
                throw new ArgumentOutOfRangeException(nameof(cert), "Token signing certificate needs private key to sign a token.");

            var provider = (RSACryptoServiceProvider)cert.PrivateKey;

            byte[] signature = provider.SignData(data, new SHA1Managed());

            //byte[] hash = data.Hash512();
            //byte[] signature = Encrypt(hash, cert, true);

            return signature;
        }

        public static bool IsSignatureValid(this byte[] data, byte[] signature, X509Certificate2 cert)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));
            if (signature == null)
                throw new ArgumentNullException(nameof(signature));
            if (cert == null)
                throw new ArgumentNullException(nameof(cert));

            var provider = (RSACryptoServiceProvider)cert.PublicKey.Key;

            bool isValid = provider.VerifyData(data, new SHA1Managed(), signature);

            //byte[] hash = data.Hash512();
            //byte[] expectedSignature = Decrypt(hash, cert);
            //bool isValid = Utility.Equals(expectedSignature, signature);

            return isValid;
        }

        #endregion
        
        #region Generator

        public static string GeneratePassword(int minLength, int maxLength, string[] characters, bool noDuplicates = false)
        {
            if (minLength >= maxLength)
                throw new ArgumentOutOfRangeException(nameof(maxLength), $"Max length ({maxLength}) should be greater the min length ({minLength}).");
            if (characters == null)
                throw new ArgumentNullException(nameof(characters));
            if ((characters.Length == 0) && (characters.All(string.IsNullOrEmpty)))
                throw new ArgumentOutOfRangeException(nameof(characters), "At least one characters set should be specified.");

            characters = characters.Where(set => !string.IsNullOrEmpty(set)).ToArray();
            
            int length = RandomNumberGenerator.GetInt32(minLength, maxLength + 1);

            var password = new StringBuilder();

            int j = 0;
            for (int i = 0; i < length; i++)
            {
                string set = characters[j];
                int index = RandomNumberGenerator.GetInt32(set.Length);
                password.Append(set[index]);
                if (!noDuplicates)
                {
                    characters[j] = set.Remove(index, 1);
                }

                j++;
                if (j == characters.Length)
                {
                    j = 0;
                }
            }

            return password.ToString();
        }

        public static string GeneratePassword(int minLength = 8, int maxLength = 12, bool noDuplicates = false)
        {
            string[] characters =
            {
                "abcdefghijklmnopqrstuvwxyz",
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                "0123456789",
                "!@#$%ˆ&*()_+-/|.,:;",
            };
            return GeneratePassword(minLength, maxLength, characters, noDuplicates);
        }

        public static string GenerateAesKey(int keySize = 256, CipherMode mode = CipherMode.CBC)
        {
            var crypto = new AesCryptoServiceProvider
            {
                KeySize = keySize,
                Mode = mode
            };
            crypto.GenerateKey();
            byte[] keyGenerated = crypto.Key;
            return System.Convert.ToBase64String(keyGenerated);
        }

        #endregion

        #endregion
    }
}