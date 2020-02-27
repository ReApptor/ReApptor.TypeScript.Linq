using System.Collections.Generic;
using System.Threading.Tasks;

namespace Renta.Extensions
{
    public static class TaskExtensions
    {
        public static async Task<T[]> WhenAllAsync<T>(this IEnumerable<Task<T>> tasks, bool multithread = true)
        {
            if (multithread)
            {
                return await Task.WhenAll(tasks);
            }

            var results = new List<T>();
            foreach (Task<T> task in tasks)
            {
                T result = await task;
                results.Add(result);
            }

            return results.ToArray();
        }
    }
}