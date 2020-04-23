using System;
using System.Collections.Generic;
using System.Xml.Linq;
using Microsoft.AspNetCore.DataProtection.Repositories;

namespace Renta.Toolkit.Configuration
{
    public sealed class ConfigurationXmlRepository : IXmlRepository
    {
        private const string KeyTemplate = @"<key id=""4a522779-0f84-4ce6-aeae-c841a2aa2ed0"" version=""1"">
  <creationDate>2019-01-01T00:00:00.000000Z</creationDate>
  <activationDate>2019-01-01T00:00:00.000000Z</activationDate>
  <expirationDate>2039-01-01T00:00:00.000000Z</expirationDate>
  <descriptor deserializerType=""Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel.AuthenticatedEncryptorDescriptorDeserializer, Microsoft.AspNetCore.DataProtection, Version=2.2.0.0, Culture=neutral, PublicKeyToken=adb9793829ddae60"">
    <descriptor>
      <encryption algorithm=""AES_256_CBC"" />
      <validation algorithm = ""HMACSHA256"" />
      <masterKey p4:requiresEncryption=""true"" xmlns:p4=""http://schemas.asp.net/2015/03/dataProtection"">
        <!-- Warning: the key below is in an unencrypted form. -->
        <value>{0}</value>
      </masterKey>
    </descriptor>
  </descriptor>
</key>";

        private readonly string _key;

        public ConfigurationXmlRepository(string key)
        {
            if (key == null)
                throw new ArgumentNullException(nameof(key));
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentOutOfRangeException(nameof(key), "Key is empty or whitespace.");

            _key = key;
        }

        public IReadOnlyCollection<XElement> GetAllElements()
        {
            string keyXml = string.Format(KeyTemplate, _key);
            XElement key = XElement.Parse(keyXml);
            return new[] { key };
        }

        public void StoreElement(XElement element, string friendlyName)
        {
            throw new NotSupportedException($"{nameof(ConfigurationXmlRepository)} is readonly repository. Use \"DisableAutomaticKeyGeneration\" to disable key generation.");
        }
    }
}