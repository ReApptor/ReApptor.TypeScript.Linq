using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace WeAre.ReApptor.Toolkit
{
    public static class BinarySerializer
    {
        public static byte[] Serialize(object source)
        {
            if (ReferenceEquals(source, null))
                throw new ArgumentNullException(nameof(source));

            var formatter = new BinaryFormatter();
            using var stream = new MemoryStream();
            formatter.Serialize(stream, source);
            return stream.ToArray();
        }

        public static T Deserialize<T>(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            var formatter = new BinaryFormatter();
            using var stream = new MemoryStream(data);
            return (T)formatter.Deserialize(stream);
        }
    }
}