using System;
using System.Threading;
using System.Threading.Tasks;

namespace Renta.Toolkit
{
    public sealed class Locker
    {
        private readonly SemaphoreSlim _lock;

        public Locker()
        {
            _lock = new SemaphoreSlim(1, 1);
        }

        public async Task<Disposer> LockAsync(TimeSpan? timeout = null)
        {
            timeout ??= TimeSpan.FromMilliseconds(Timeout.Infinite);
            
            if (await _lock.WaitAsync(timeout.Value))
            {
                return new Disposer(_lock);
            }
            
            throw new TimeoutException();
        }

        public Disposer Lock(TimeSpan? timeout = null)
        {
            return LockAsync(timeout).GetAwaiter().GetResult();
        }

        public readonly struct Disposer : IDisposable
        {
            private readonly SemaphoreSlim _lock;

            public Disposer(SemaphoreSlim @lock)
            {
                _lock = @lock;
            }
            
            public void Dispose()
            {
                _lock.Release();
            }
        }
    }
}