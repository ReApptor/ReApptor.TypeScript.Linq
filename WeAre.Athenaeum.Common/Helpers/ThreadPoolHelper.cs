using System;
using System.Threading;
using Microsoft.Extensions.Logging;

namespace WeAre.Athenaeum.Common.Helpers
{
    public static class ThreadPoolHelper
    {
        public static void ConfigureMinThreads(int cores, ILogger logger, int threadsPerCore = AthenaeumConstants.ThreadsPerCore)
        {
            ThreadPool.GetMinThreads(out int initialWorkerThreads, out int initialCompletionPortThread);
            int threads = Math.Max(threadsPerCore * cores, Math.Max(initialWorkerThreads, initialCompletionPortThread));
            bool success = ThreadPool.SetMinThreads(threads, threads);
            if (logger != null)
            {
                string status = success ? "SUCCESS" : "FAILED";
                string message = $"ThreadPoolHelper. Set min threads: cores={cores}, initialWorkerThreads={initialWorkerThreads}, initialCompletionPortThread={initialCompletionPortThread}, newThreads={threads}. {status}.";
                logger.Log(success ? LogLevel.Information : LogLevel.Warning, message);
            }
        }
    }
}