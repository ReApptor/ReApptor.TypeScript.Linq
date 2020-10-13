using System;
using System.Collections.Generic;

namespace WeAre.Athenaeum.Toolkit.Extensions
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
        
        public static T[] AddRange<T>(this T[] items, IEnumerable<T> value)
        {
            if (items != null)
            {
                var result = new List<T>(items);

                if (value != null)
                {
                    result.AddRange(value);
                }

                return result.ToArray();
            }

            return new T[0];
        }
    }
}