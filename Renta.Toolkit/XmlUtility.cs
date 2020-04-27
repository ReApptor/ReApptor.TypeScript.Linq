using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Schema;
using Renta.Toolkit.Extensions;

namespace Renta.Toolkit
{
    public static class XmlUtility
    {
        #region Private

        private static bool IsCommittedNamespace(XmlElement element, string prefix, string value)
        {
            if (element == null)
            {
                throw new ArgumentNullException(nameof(element));
            }
            string name = (prefix.Length > 0) ? ("xmlns:" + prefix) : "xmlns";
            return (element.HasAttribute(name) && (element.GetAttribute(name) == value));
        }

        private static bool HasNamespace(XmlElement element, string prefix, string value)
        {
            return (IsCommittedNamespace(element, prefix, value) || ((element.Prefix == prefix) && (element.NamespaceURI == value)));
        }

        private static bool IsRedundantNamespace(XmlElement element, string prefix, string value)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            
            for (XmlNode node = element.ParentNode; node != null; node = node.ParentNode)
            {
                if ((node is XmlElement xmlElement) && (HasNamespace(xmlElement, prefix, value)))
                {
                    return true;
                }
            }
            
            return false;
        }

        private static void DeleteRedundantNamespaces(XmlElement elem)
        {
            if (elem == null)
            {
                return;
            }
            
            foreach (var element in elem.ChildNodes.OfType<XmlElement>())
            {
                DeleteRedundantNamespaces(element);
                if (IsRedundantNamespace(element, element.Prefix, element.NamespaceURI))
                {
                    string name = "xmlns:" + element.Prefix;
                    element.RemoveAttribute(name);
                }
            }
        }

        #endregion

        #region Constants

        /// <summary>
        /// "//*[local-name()='{0}' and namespace-uri()=namespace-uri('{1}')]"
        /// </summary>
        public const string XPathPattern = @"//*[local-name()='{0}' and namespace-uri()=namespace-uri('{1}')]";

        #endregion

        #region XPath

        public static string GetXPath(string localName, string namespaceUri = "")
        {
            if (localName == null)
                throw new ArgumentNullException(nameof(localName));
            if (string.IsNullOrWhiteSpace(localName))
                throw new ArgumentOutOfRangeException(nameof(localName), "Local name is empty or whitespace.");

            string xpath = string.Format(XPathPattern, localName, namespaceUri);
            return xpath;
        }

        public static string GetXPath(XmlElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            string xpath = GetXPath(element.LocalName, element.NamespaceURI);
            return xpath;
        }

        public static string GetXPath(XmlDocument doc)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));
            if (doc.DocumentElement == null)
                throw new ArgumentOutOfRangeException(nameof(doc), "doc.DocumentElement can not be null");

            string xpath = GetXPath(doc.DocumentElement);
            return xpath;
        }

        #endregion

        public static XmlDocument DeleteComments(XmlDocument doc)
        {
            XmlNodeList list = doc.SelectNodes("//comment()");
            if (list != null)
            {
                foreach (XmlNode node in list)
                {
                    node.ParentNode?.RemoveChild(node);
                }
            }
            return doc;
        }

        public static XmlDocument DeleteRedundantNamespaces(XmlDocument doc)
        {
            if (doc == null)
            {
                return null;
            }
            var document = new XmlDocument();
            document.LoadXml(doc.OuterXml);
            DeleteRedundantNamespaces(document.DocumentElement);
            return document;
        }

        public static XmlDocument AddXmlDeclaration(XmlDocument doc, Encoding encoding)
        {
            if (doc?.DocumentElement != null)
            {
                if ((doc.FirstChild != null) && (doc.FirstChild.NodeType == XmlNodeType.XmlDeclaration))
                {
                    doc.RemoveChild(doc.FirstChild);
                }
                string name = (!string.IsNullOrWhiteSpace(encoding.HeaderName)) ? encoding.HeaderName : encoding.BodyName;
                XmlDeclaration xmlDeclaration = doc.CreateXmlDeclaration("1.0", name, string.Empty);
                doc.InsertBefore(xmlDeclaration, doc.DocumentElement);
            }
            return doc;
        }

        public static XmlDocument AddXmlDeclaration(XmlDocument doc)
        {
            return AddXmlDeclaration(doc, Encoding.UTF8);
        }

        public static XmlDocument RemoveXmlDeclaration(XmlDocument doc)
        {
            if (doc?.DocumentElement != null)
            {
                if ((doc.FirstChild != null) && (doc.FirstChild.NodeType == XmlNodeType.XmlDeclaration))
                {
                    doc.RemoveChild(doc.FirstChild);
                }
            }
            return doc;
        }

        public static XmlDocument Copy(XmlDocument from)
        {
            if (from == null)
            {
                return null;
            }
            var doc = new XmlDocument();
            doc.LoadXml(from.OuterXml);
            return doc;
        }

        public static byte[] ToByteArray(XmlDocument doc)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));

            using var stream = new MemoryStream();
            doc.Save(stream);
            return stream.ToArray();
        }

        /// <summary>
        /// Convert XML to pretty format with new lines and idents.
        /// </summary>
        public static string FormatXml(XmlDocument doc)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));

            var builder = new StringBuilder();

            var settings = new XmlWriterSettings
            {
                OmitXmlDeclaration = true,
                Indent = true,
                NewLineOnAttributes = true
            };

            using (var xmlWriter = XmlWriter.Create(builder, settings))
            {
                doc.Save(xmlWriter);
            }

            return builder.ToString();
        }

        public static string FormatXml(string xml)
        {
            if (xml == null)
                throw new ArgumentNullException(nameof(xml));
            if (string.IsNullOrWhiteSpace(xml))
                throw new ArgumentOutOfRangeException(nameof(xml), "Xml is empty or whitespace.");

            var doc = new XmlDocument();
            doc.LoadXml(xml);

            return FormatXml(doc);
        }
        
        public static Encoding GetEncoding(XmlDocument doc)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));

            if (doc.FirstChild.NodeType == XmlNodeType.XmlDeclaration)
            {
                string encodingName = (doc.FirstChild as XmlDeclaration)?.Encoding;
                if (!string.IsNullOrEmpty(encodingName))
                {
                    Encoding encoding = Encoding.GetEncoding(encodingName);
                    return encoding;
                }
            }

            return null;
        }

        public static XmlDocument LoadXml(byte[] bytes, ref Encoding encoding)
        {
            if (bytes == null)
                throw new ArgumentNullException(nameof(bytes));

            encoding ??= Encoding.Default;

            string xml = encoding.GetString(bytes);

            var doc = new XmlDocument();

            doc.LoadXml(xml);

            Encoding docEncoding = doc.GetEncoding();

            if (docEncoding != null && docEncoding.EncodingName != encoding.EncodingName)
            {
                try
                {
                    var encodedDoc = new XmlDocument();
                    using (var ms = new MemoryStream(bytes))
                    {
                        encodedDoc.Load(ms);
                    }
                    doc = encodedDoc;
                }
                catch (XmlException)
                {
                    docEncoding = null;
                }
            }

            encoding = docEncoding ?? encoding;

            return doc;
        }

        public static string FirstOrDefault(XmlDocument doc, string tagName)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));
            if (tagName == null)
                throw new ArgumentNullException(nameof(tagName));
            if (string.IsNullOrWhiteSpace(tagName))
                throw new ArgumentOutOfRangeException(nameof(tagName), "Tag name is empty or whitespace.");

            XmlNodeList tags = doc.GetElementsByTagName(tagName);
            return (tags.Count > 0) ? tags[0]?.InnerText : null;
        }
        
        public static XmlReader ToXmlReader(XmlDocument doc)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));
            if (doc.DocumentElement == null)
                throw new ArgumentOutOfRangeException(nameof(doc), "Xml document has no root element.");

            return new XmlNodeReader(doc.DocumentElement);
        }

        public static void Validate(XmlDocument doc, XmlDocument schemaXsd)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));
            if (schemaXsd == null)
                throw new ArgumentNullException(nameof(schemaXsd));

            var readerSettings = new XmlReaderSettings { ValidationType = ValidationType.Schema };
            readerSettings.ValidationFlags |= XmlSchemaValidationFlags.ProcessInlineSchema;
            readerSettings.ValidationFlags |= XmlSchemaValidationFlags.ProcessSchemaLocation;

            using (XmlReader schemaXsdReader = schemaXsd.ToXmlReader())
            {
                readerSettings.Schemas.Add(null, schemaXsdReader);

                ValidationEventArgs error = null;
                readerSettings.ValidationEventHandler += delegate(object sender, ValidationEventArgs args)
                {
                    error = args;
                };

                using (var stringReader = new StringReader(doc.OuterXml))
                {
                    using (var xmlReader = XmlReader.Create(stringReader, readerSettings))
                    {
                        while (xmlReader.Read())
                        {
                        }
                    }
                }

                if (error != null)
                    throw new XmlSchemaValidationException($"Xml validation failed. Severity:\"{error.Severity}\". Message:\"{error.Message}\".");
            }
        }
    }
}