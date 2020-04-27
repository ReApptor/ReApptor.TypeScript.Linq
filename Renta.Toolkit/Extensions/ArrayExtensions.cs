using System;
using System.Collections.Generic;

namespace Renta.Toolkit.Extensions
{
    public static class ArrayExtensions
    {        
        public static T[] Add<T>(this T[] items, T item)
        {
            if (items == null)
                throw new ArgumentNullException(nameof(items));

            var list = new List<T>(items) { item };
            return list.ToArray();
        }
    }
}