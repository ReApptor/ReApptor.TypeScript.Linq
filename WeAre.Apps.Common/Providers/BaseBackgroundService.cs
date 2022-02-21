using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using WeAre.ReApptor.Common.Providers;

namespace WeAre.Apps.Common.Providers
{
    public abstract class BaseBackgroundService : BackgroundService
    {
        private static readonly HashSet<string> InProcess = new HashSet<string>();
        private static readonly Random Rnd = new Random(DateTime.Now.Millisecond);
        private readonly CancellationTokenSource _cancellationToken = new CancellationTokenSource();
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private Task _executingTask;
        private bool _disposed;
        private bool _firstCall = true;

        private static bool Start(string name, bool singleton)
        {
            if (!singleton)
            {
                return true;
            }
            
            lock (InProcess)
            {
                if (InProcess.Contains(name))
                {
                    return false;
                }
                
                InProcess.Add(name);
                return true;
            }
        }

        private static void Stop(string name, bool singleton)
        {
            if (!singleton)
            {
                return;
            }
            
            lock (InProcess)
            {
                if (InProcess.Contains(name))
                {
                    InProcess.Remove(name);
                }
            }
        }

        private TimeSpan GetDelay()
        {
            if (_firstCall)
            {
                int mlsec = (int) Delay.TotalMilliseconds / 2;
                mlsec = mlsec + Rnd.Next(mlsec);
                return TimeSpan.FromMilliseconds(mlsec);
            }

            return Delay;
        }

        protected BaseBackgroundService(IServiceScopeFactory factory, ILoggerFactory loggerFactory)
        {
            if (loggerFactory == null)
                throw new ArgumentNullException(nameof(loggerFactory));

            Logger = loggerFactory.CreateLogger(GetType());
            _serviceScopeFactory = factory ?? throw new ArgumentNullException(nameof(factory));
        }
        
        protected BaseBackgroundService(IServiceScopeFactory factory, ILogger logger)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(factory));
            _serviceScopeFactory = factory ?? throw new ArgumentNullException(nameof(factory));
        }

        protected virtual async Task SystemInvokeAsync(IServiceScope scope)
        {
            await InvokeAsync(scope);
        }

        protected abstract Task InvokeAsync(IServiceScope scope);
        
        protected abstract TimeSpan Delay { get; }

        /// <summary>
        /// Only one named service executes simultaneously.
        /// </summary>
        protected virtual bool Singleton { get; } = true;

        /// <summary>
        /// Authentication per invoke (scoped) or per service (singleton)
        /// </summary>
        protected virtual bool AuthScoped { get; } = false; 

        protected string Name => GetType().Name;
        
        protected string FullName => GetType().FullName;
        
        protected ILogger Logger { get; }

        protected IServiceScope CreateScope(bool auth = false)
        {
            IServiceScope scope = _serviceScopeFactory.CreateScope();

            if (auth)
            {
                SecurityProvider securityProvider = scope.ServiceProvider.GetRequiredService<SecurityProvider>();

                string user = SecurityProvider.Options.MigrationConsoleUser;

                if (string.IsNullOrWhiteSpace(user))
                {
                    user = RentaConstants.Db.MigrationConsoleUser;
                }

                securityProvider.SignIn(user);
            }

            return scope;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            using IServiceScope scope = CreateScope(true);
            while (!cancellationToken.IsCancellationRequested)
            {
                TimeSpan delay = GetDelay();
                
                if (_firstCall)
                {
                    _firstCall = false;
                    Logger.LogInformation($"Background process \"{Name}\" ignores first call, will be executed in next iteration at {DateTime.UtcNow.Add(delay)}.");
                }
                else
                {
                    if (Start(FullName, Singleton))
                    {
                        try
                        {
                            if (AuthScoped)
                            {
                                using IServiceScope innerScope = CreateScope(true);
                                await SystemInvokeAsync(innerScope);
                            }
                            else
                            {
                                await SystemInvokeAsync(scope);
                            }
                        }
                        catch (Exception ex)
                        {
                            Logger.LogError(ex, $"Background process \"{Name}\" invoking exception: \"{ex.Message}\".");
                        }
                        finally
                        {
                            Stop(FullName, Singleton);
                        }
                    }
                    else
                    {
                        Logger.LogWarning($"Background process \"{Name}\" cannot be started, because it is already invoking.");
                    }
                }

                await Task.Delay(delay, cancellationToken);
            }
                
            Logger.LogInformation($"Background process \"{Name}\" stopped.");
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Logger.LogInformation($"Background process \"{Name}\" start.");

            // Store the task we're executing
            _executingTask = ExecuteAsync(_cancellationToken.Token);

            // If the task is completed then return it,
            // this will bubble cancellation and failure to the caller
            if (_executingTask.IsCompleted)
            {
                return _executingTask;
            }

            // Otherwise it's running
            return Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            // Stop called without start
            if (_executingTask == null)
            {
                return;
            }

            try
            {
                Logger.LogInformation($"{Name} stop.");
                
                // Signal cancellation to the executing method
                _cancellationToken.Cancel();
            }
            finally
            {
                // Wait until the task completes or the stop token triggers
                await Task.WhenAny(_executingTask, Task.Delay(Timeout.Infinite, cancellationToken));
            }
        }

        public override void Dispose()
        {
            if (!_disposed)
            {
                _disposed = true;
                _cancellationToken.Cancel();
                base.Dispose();
            }
        }
    }
}