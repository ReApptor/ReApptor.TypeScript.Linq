using System;
using System.IO;
using System.Runtime.Serialization;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace WeAre.Athenaeum.Toolkit
{
    public static class Serializer
    {
        #region Declaration

        /// <summary>
        /// Serialization type
        /// </summary>
        [Serializable]
        public enum Type
        {
            DataContractSerializer,

            XmlSerializer,
        }
        
        #endregion
        
        /// <summary>
        /// Serialize the input object using "XmlSerializer" or "DataContractSerializer"
        /// </summary>
        /// <param name="type">The type of object to serialize</param>
        /// <param name="source">The serialazable object</param>
        /// <param name="serializer">Serialization type</param>
        /// <returns>XML document containing the serialized data</returns>
        public static XmlDocument Serialize(System.Type type, object source, Type serializer = Type.DataContractSerializer)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));
            if (ReferenceEquals(source, null))
                throw new ArgumentNullException(nameof(source));

            var sb = new StringBuilder();
            var doc = new XmlDocument();
            var settings = new XmlWriterSettings
            {
                OmitXmlDeclaration = true,
                NamespaceHandling = NamespaceHandling.OmitDuplicates,
                Indent = true
            };
            using var writer = XmlWriter.Create(sb, settings);
            if (serializer == Type.XmlSerializer)
            {
                new XmlSerializer(type).Serialize(writer, source);
                writer.Flush();
                doc.LoadXml(sb.ToString());
            }
            else
            {
                new DataContractSerializer(type).WriteObject(writer, source);
                writer.Flush();
                doc.LoadXml(sb.ToString());
            }
            return doc;
        }

        /// <summary>
        /// Serialize the input object using "XmlSerializer" or "DataContractSerializer"
        /// </summary>
        /// <typeparam name="T">The type of object to serialize</typeparam>
        /// <param name="source">The serialazable object</param>
        /// <param name="serializer">Serialization type</param>
        /// <returns>XML document containing the serialized data</returns>
        public static XmlDocument Serialize<T>(T source, Type serializer = Type.DataContractSerializer)
        {
            return Serialize(typeof(T), source, serializer);
        }

        public static object Deserialize(System.Type type, XmlDocument doc, System.Type[] knownTypes)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));
            if (doc.DocumentElement == null)
                throw new ArgumentOutOfRangeException(nameof(doc), "doc.DocumentElement can not be null");

            using var reader = new XmlNodeReader(doc.DocumentElement);
            var serializer = ((knownTypes != null) && (knownTypes.Length > 0))
                ? new DataContractSerializer(type, knownTypes)
                : new DataContractSerializer(type);

            return serializer.ReadObject(reader);
        }

        public static object Deserialize(System.Type type, XmlDocument doc, Type serializer = Type.DataContractSerializer)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc));
            if (doc.DocumentElement == null)
                throw new ArgumentOutOfRangeException(nameof(doc), "doc.DocumentElement can not be null");

            using var reader = new XmlNodeReader(doc.DocumentElement);
            if (serializer == Type.XmlSerializer)
            {
                return new XmlSerializer(type).Deserialize(reader);
            }
                
            return new DataContractSerializer(type).ReadObject(reader);
        }

        public static T Deserialize<T>(XmlDocument doc, System.Type[] knownTypes)
        {
            return (T)Deserialize(typeof(T), doc, knownTypes);
        }

        public static object Deserialize(System.Type type, string xml, System.Type[] knownTypes)
        {
            if (xml == null)
                throw new ArgumentNullException(nameof(xml));
            if (string.IsNullOrWhiteSpace(xml))
                throw new ArgumentOutOfRangeException(nameof(xml), "Xml is empty or whitespace.");

            var doc = new XmlDocument();
            doc.LoadXml(xml);
            return Deserialize(type, doc, knownTypes);
        }

        public static object Deserialize(System.Type type, string xml, Type serializer = Type.DataContractSerializer)
        {
            if (xml == null)
                throw new ArgumentNullException(nameof(xml));
            if (string.IsNullOrWhiteSpace(xml))
                throw new ArgumentOutOfRangeException(nameof(xml), "Xml is empty or whitespace.");

            var doc = new XmlDocument();
            doc.LoadXml(xml);
            return Deserialize(type, doc, serializer);
        }

        public static T Deserialize<T>(XmlDocument doc, Type serializer = Type.DataContractSerializer)
        {
            return (T)Deserialize(typeof(T), doc, serializer);
        }

        public static T Deserialize<T>(string xml, Type serializer = Type.DataContractSerializer)
        {
            return (T)Deserialize(typeof(T), xml, serializer);
        }

        public static T Deserialize<T>(string xml, System.Type[] knownTypes)
        {
            return (T)Deserialize(typeof(T), xml, knownTypes);
        }

        public static T Deserialize<T>(Stream stream, Type serializer = Type.DataContractSerializer)
        {
            if (stream == null)
                throw new ArgumentNullException(nameof(stream));

            var doc = new XmlDocument();
            doc.Load(stream);
            return Deserialize<T>(doc, serializer);
        }
    }
}
