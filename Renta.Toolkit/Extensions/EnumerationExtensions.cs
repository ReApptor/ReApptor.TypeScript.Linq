using System;
using System.Collections.Generic;
using System.Linq;

namespace Renta.Toolkit.Extensions
{
    public static class EnumerationExtensions
    {
        public static IEnumerable<T[]> Chunk<T>(this IEnumerable<T> items, int size)
        {
            T[] array = items as T[] ?? items.ToArray();
            for (int i = 0; i < array.Length; i += size)
            {
                T[] chunk = new T[Math.Min(size, array.Length - i)];
                Array.Copy(array, i, chunk, 0, chunk.Length);
                yield return chunk;
            }
        }
        
        /// <summary>
        /// Returns the set of items, made distinct by the selected value.
        /// </summary>
        /// <typeparam name="TSource">The type of the source.</typeparam>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="source">The source collection.</param>
        /// <param name="selector">A function that selects a value to determine unique results.</param>
        /// <returns>IEnumerable&lt;TSource&gt;.</returns>
        public static IEnumerable<TSource> DistinctBy<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> selector)
        {
            var set = new HashSet<TResult>();

            foreach(TSource item in source)
            {
                var selectedValue = selector(item);

                if (set.Add(selectedValue))
                {
                    yield return item;
                }
            }
        }
    }
}