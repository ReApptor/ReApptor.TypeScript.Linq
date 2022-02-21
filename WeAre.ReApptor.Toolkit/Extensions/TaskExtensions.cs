using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WeAre.ReApptor.Toolkit.Extensions
{
    public static class TaskExtensions
    {
        public static async Task WhenAllAsync(this IEnumerable<Task> tasks, bool multithread = true)
        {
            if (tasks == null)
                throw new ArgumentNullException(nameof(tasks));
            
            if (multithread)
            {
                await Task.WhenAll(tasks);
                return;
            }

            foreach (Task task in tasks)
            {
                await task;
            }
        }

        public static async Task<T[]> WhenAllAsync<T>(this IEnumerable<Task<T>> tasks, bool multithread = true)
        {
            if (tasks == null)
                throw new ArgumentNullException(nameof(tasks));

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