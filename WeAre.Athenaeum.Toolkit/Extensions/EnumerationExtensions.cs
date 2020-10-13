using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WeAre.Athenaeum.Toolkit.Extensions
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

        public static string Join<T>(this IEnumerable<T> items, string separator, Func<T, string> transform)
        {
            return string.Join(separator, items.Select(transform));
        }

        ///<summary>Finds the index of the first item matching an expression in an enumerable.</summary>
        ///<param name="items">The enumerable to search.</param>
        ///<param name="predicate">The expression to test the items against.</param>
        ///<returns>The index of the first matching item, or -1 if no items match.</returns>
        public static int FindIndex<T>(this IEnumerable<T> items, Func<T, bool> predicate)
        {
            if (items == null)
                throw new ArgumentNullException(nameof(items));
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            int index = 0;
            foreach (T item in items)
            {
                if (predicate(item))
                {
                    return index;
                }

                index++;
            }

            return -1;
        }

        ///<summary>Finds the index of the first occurrence of an item in an enumerable.</summary>
        ///<param name="items">The enumerable to search.</param>
        ///<param name="item">The item to find.</param>
        ///<returns>The index of the first matching item, or -1 if the item was not found.</returns>
        public static int IndexOf<T>(this IEnumerable<T> items, T item)
        {
            return items.FindIndex(i => EqualityComparer<T>.Default.Equals(item, i));
        }

        public static async Task WhenAllAsync<T>(this IEnumerable<T> items, Func<T, Task> task, bool multithread = true)
        {
            if (items == null)
                throw new ArgumentNullException(nameof(items));
            if (task == null)
                throw new ArgumentNullException(nameof(task));

            IEnumerable<Task> tasks = items.Select(task);

            await tasks.WhenAllAsync(multithread);
        }
    }
}