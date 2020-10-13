using System.IO;
using System.Threading.Tasks;

namespace WeAre.Athenaeum.Toolkit.Extensions
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
        
        public static async Task<MemoryStream> CompressAsync(this Stream stream, bool deflate = true)
        {
            return await Utility.CompressAsync(stream, deflate);
        }
        
        public static async Task<MemoryStream> DecompressAsync(this Stream stream, bool deflate = true)
        {
            return await Utility.DecompressAsync(stream, deflate);
        }
    }
}