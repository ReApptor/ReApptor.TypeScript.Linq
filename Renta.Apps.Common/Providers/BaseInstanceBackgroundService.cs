using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Renta.Toolkit.ProcessLocks;

namespace Renta.Apps.Common.Providers
{
    /// <summary>
    /// Background service with ProcessLocker, AuthScoped is enabled (creates new scope automatically)
    /// </summary>
    public abstract class BaseInstanceBackgroundService : BaseBackgroundService
    {
        protected virtual async Task ProcessLockMessageAsync(ProcessLockMessage message)
        {
            Logger.LogInformation($"InstanceBackgroundService {message.Name} MachineName:\"{Environment.MachineName}\" Action:\"{message.Action}\" Timestamp:\"{message.Timestamp}\".");
            await Task.FromResult(0);
        }

        protected BaseInstanceBackgroundService(IServiceScopeFactory factory, ILoggerFactory loggerFactory)
            : base(factory, loggerFactory)
        {
        }

        protected BaseInstanceBackgroundService(IServiceScopeFactory factory, ILogger logger)
            : base(factory, logger)
        {
        }

        protected override async Task InvokeAsync(IServiceScope scope)
        {
            await Task.FromResult(0);
        }

        protected virtual async Task InvokeAsync(DateTime? timestamp, IServiceScope scope)
        {
            await InvokeAsync(scope);
        }

        protected override async Task SystemInvokeAsync(IServiceScope scope)
        {
            var locker = scope.ServiceProvider.GetRequiredService<IProcessLocker>();
            
            await ProcessLockProvider.InvokeAsync(locker, Name, async timestamp => await InvokeAsync(timestamp, scope), TimeoutInSeconds, DelayTimeoutInSeconds, ProcessLockMessageAsync);
        }

        protected override bool AuthScoped => true;
        
        protected int DelayTimeoutInSeconds => (int) Delay.TotalSeconds;

        protected virtual int TimeoutInSeconds => 2 * DelayTimeoutInSeconds;
    }
}