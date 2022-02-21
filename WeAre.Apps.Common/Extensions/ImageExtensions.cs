using System;
using System.IO;
using SixLabors.ImageSharp;

namespace WeAre.Apps.Common.Extensions
{
    public static class ImageExtensions
    {
        public static byte[] SaveAsPng(this Image image)
        {
            if (image == null)
                throw new ArgumentNullException(nameof(image));
            
            using (var stream = new MemoryStream())
            {
                image.SaveAsPng(stream);

                return stream.ToArray();
            }
        }
    }
}