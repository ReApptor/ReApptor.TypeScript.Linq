using System.IO;
using System.Threading.Tasks;

namespace Renta.Extensions
{
    public static class StreamExtensions
    {
        public static byte[] ToByteArray(this Stream stream)
        {
            return Utility.ToByteArray(stream);
        }
        
        public static async Task<byte[]> ToByteArrayAsync(this Stream stream)
        {
            return await Utility.ToByteArrayAsync(stream);
        }
    }
}