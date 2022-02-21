using System.Text;
using System.Xml;

namespace WeAre.ReApptor.Toolkit.Extensions
{
    public static class XmlDocumentExtensions
    {
        public static Encoding GetEncoding(this XmlDocument doc)
        {
            return XmlUtility.GetEncoding(doc);
        }

        public static XmlDocument LoadXml(this byte[] bytes, ref Encoding encoding)
        {
            return XmlUtility.LoadXml(bytes, ref encoding);
        }

        public static XmlDocument LoadXml(this byte[] bytes)
        {
            Encoding encoding = null;
            return XmlUtility.LoadXml(bytes, ref encoding);
        }

        public static string FirstOrDefault(this XmlDocument doc, string tagName)
        {
            return XmlUtility.FirstOrDefault(doc, tagName);
        }

        public static XmlReader ToXmlReader(this XmlDocument doc)
        {
            return XmlUtility.ToXmlReader(doc);
        }

        public static void Validate(this XmlDocument doc, XmlDocument schema)
        {
            XmlUtility.Validate(doc, schema);
        }
    }
}