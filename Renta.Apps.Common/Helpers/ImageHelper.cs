using Renta.Apps.Common.Extensions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Renta.Apps.Common.Helpers
{
    public static class ImageHelper
    {
        #region Private
        
        private static void ShrinkImage(Image<Rgba32> image, int maxImageSizeInPixels)
        {
            if ((image.Width > maxImageSizeInPixels) || (image.Height > maxImageSizeInPixels))
            {
                float k = (image.Width > image.Height)
                    ? maxImageSizeInPixels / (float)image.Width
                    : maxImageSizeInPixels / (float)image.Height;

                int width = (int)(k * image.Width);
                int height = (int)(k * image.Height);
                        
                image.Mutate(operation => operation.Resize(width, height));
            }
        }
        
        #endregion
        
        public static byte[] ConvertImage(byte[] rawData, int maxImageSizeInPixels = RentaConstants.Ui.MaxImageSizeInPixels)
        {
            using Image<Rgba32> image = Image.Load(rawData);
            
            ShrinkImage(image, maxImageSizeInPixels);

            rawData = image.SaveAsPng();

            return rawData;
        }

        public static byte[] ConvertToThumbnail(this byte[] rawData, int maxImageSizeInPixels = RentaConstants.Ui.MaxImageSizeInPixels / 4)
        {
            using Image<Rgba32> image = Image.Load(rawData);
            
            ShrinkImage(image, maxImageSizeInPixels);

            rawData = image.SaveAsPng();

            return rawData;
        }

        public static byte[] RotateLeft(byte[] rawData)
        {
            using Image<Rgba32> image = Image.Load(rawData);
            
            image.Mutate(operation => operation.Rotate(-90));

            rawData = image.SaveAsPng();

            return rawData;
        }
        
        public static byte[] RotateRight(byte[] rawData)
        {
            using Image<Rgba32> image = Image.Load(rawData);
            
            image.Mutate(operation => operation.Rotate(90));

            rawData = image.SaveAsPng();

            return rawData;
        }
    }
}