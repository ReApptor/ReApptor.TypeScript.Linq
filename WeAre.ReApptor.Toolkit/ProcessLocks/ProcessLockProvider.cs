using System;
using System.Threading.Tasks;

namespace WeAre.ReApptor.Toolkit.ProcessLocks
{
    public static class ProcessLockProvider
    {
        private static readonly Locker Lock = new Locker();
        
        private static bool OutTime(DateTime from, DateTime to, int timeoutInSeconds, bool @default)
        {
            return (timeoutInSeconds > 0)
                ? (to - from).TotalSeconds >= (timeoutInSeconds - 1)
                : @default;
        }

        private static async Task InvokeCallbackAsync(Func<ProcessLockMessage, Task> callback, ProcessLockState state, ProcessLockAction action, DateTime timestamp)
        {
            if (callback != null)
            {
                var message = new ProcessLockMessage
                {
                    Name = state.Name,
                    Action = action,
                    Timestamp = timestamp
                };
                
                await callback(message);
            }
        }

        private static async Task<(ProcessLockState State, ProcessLockAction Action)> InitializeAsync(IProcessLocker locker, string name, DateTime timestamp, int timeoutInSeconds = 0, int delayTimeoutInSeconds = 0)
        {
            ProcessLockState state = await locker.GetStateAsync(name);
            
            state ??= new ProcessLockState
            {
                Name = name,
                Status = ProcessLockStatus.Completed
            };

            bool expired = (state.Status == ProcessLockStatus.Running) &&
                           (
                               (state.StartAt == null) ||
                               (state.StartAt == DateTime.MinValue) ||
                               (OutTime(state.StartAt.Value, timestamp, timeoutInSeconds, false))
                           );

            if (expired)
            {
                state.Status = ProcessLockStatus.Completed;
                state.EndAt = timestamp;
                state.StartAt ??= timestamp;

                await locker.SetStateAsync(state);

                return (state, ProcessLockAction.Timeout);
            }

            bool canRun = (state.Status == ProcessLockStatus.Completed) &&
                          (
                              (state.EndAt == null) ||
                              (state.EndAt == DateTime.MinValue) ||
                              (OutTime(state.EndAt.Value, timestamp, delayTimeoutInSeconds, true))
                          );

            if (!canRun)
            {
                return (state, ProcessLockAction.Skip);
            }

            state.Status = ProcessLockStatus.Running;
            state.StartAt = DateTime.UtcNow;
            state.EndAt = null;
            
            await locker.SetStateAsync(state);

            return (state, ProcessLockAction.Start);
        }

        public static async Task<bool> InvokeAsync(IProcessLocker locker, string name, Func<Task> action, int timeoutInSeconds = 0, int delayTimeoutInSeconds = 0, Func<ProcessLockMessage, Task> callback = null) 
        {
            return await InvokeAsync(locker, name, timestamp => action(), timeoutInSeconds, delayTimeoutInSeconds, callback);
        }

        public static async Task<bool> InvokeAsync(IProcessLocker locker, string name, Func<DateTime?, Task> action, int timeoutInSeconds = 0, int delayTimeoutInSeconds = 0, Func<ProcessLockMessage, Task> callback = null)
        {
            if (locker == null)
                throw new ArgumentNullException(nameof(locker));
            if (action == null)
                throw new ArgumentNullException(nameof(action));

            name = (!string.IsNullOrWhiteSpace(name))
                ? name
                : "<global>";

            DateTime timestamp = DateTime.UtcNow;
            
            (ProcessLockState State, ProcessLockAction Action) result;
            
            using (await Lock.LockAsync())
            {
                result = await InitializeAsync(locker, name, timestamp, timeoutInSeconds, delayTimeoutInSeconds);
            }
            
            await InvokeCallbackAsync(callback, result.State, result.Action, timestamp);

            if (result.Action != ProcessLockAction.Start)
            {
                return false;
            }

            ProcessLockState state = result.State;

            try
            {
                await action(state.Timestamp);

                state.Timestamp = state.StartAt;
            }
            finally
            {
                state.Status = ProcessLockStatus.Completed;
                state.EndAt = DateTime.UtcNow;
                
                await locker.SetStateAsync(state);
                
                await InvokeCallbackAsync(callback, state, ProcessLockAction.Complete, timestamp);
            }

            return true;
        }
    }
}