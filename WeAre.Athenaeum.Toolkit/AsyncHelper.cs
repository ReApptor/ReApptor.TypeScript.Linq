using System;
using System.Threading;
using System.Threading.Tasks;

namespace WeAre.Athenaeum.Toolkit
{
    /// <summary>
    /// Contains helper function to run async functions sync.
    /// Prefer using: await AsyncMethod();
    /// </summary>
    public static class AsyncHelper
    {
        private static readonly TaskFactory TaskFactory = new TaskFactory(CancellationToken.None, TaskCreationOptions.None, TaskContinuationOptions.None, TaskScheduler.Default);

        public static TResult RunSync<TResult>(this Func<Task<TResult>> func) => TaskFactory
            .StartNew(func)
            .Unwrap()
            .GetAwaiter()
            .GetResult();

        public static void RunSync(this Func<Task> func) => TaskFactory
            .StartNew(func)
            .Unwrap()
            .GetAwaiter()
            .GetResult();
    }
}