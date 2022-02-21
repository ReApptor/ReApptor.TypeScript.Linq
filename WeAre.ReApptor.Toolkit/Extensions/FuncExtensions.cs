using System;
using System.Threading.Tasks;

namespace WeAre.ReApptor.Toolkit.Extensions
{
    public static class FuncExtensions
    {
        public static async Task InvokeAsync(this Func<Task> action, int attempts = 1, int delay = 100)
        {
            await Utility.InvokeAsync(action, attempts, delay);
        }

        public static async Task<T> InvokeAsync<T>(this Func<Task<T>> action, int attempts = 1, int delay = 100)
        {
            return await Utility.InvokeAsync(action, attempts, delay);
        }
    }
}