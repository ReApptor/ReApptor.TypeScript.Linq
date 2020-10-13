using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using WeAre.Athenaeum.Toolkit.ProcessLocks;
using Xunit;

namespace WeAre.Athenaeum.Toolkit.UnitTest
{
    public sealed class ProcessLockTests
    {
        #region Private
        
        private const int ActionDelay = 1000; 
        private int _processed;
        private int _processing;
        private int _simultaneous;
        
        private async Task ActionAsync()
        {
            _processing++;

            if (_processing > _simultaneous)
            {
                _simultaneous = _processing;
            }
            
            await Task.Delay(ActionDelay);

            _processed++;
            _processing--;
        }
        
        private async Task SingleTestAsync(IProcessLocker locker, string name)
        {
            _processing = 0;
            _processed = 0;
            _simultaneous = 0;

            await ProcessLockProvider.InvokeAsync(locker, name, ActionAsync);
            
            Assert.Equal(0, _processing);
            Assert.Equal(1, _simultaneous);
            Assert.Equal(1, _processed);
        }
        
        private async Task MultipleTestAsync(IProcessLocker locker, string name)
        {
            _processing = 0;
            _processed = 0;
            _simultaneous = 0;
            
            const int count = 100; 

            var stopwatch = new Stopwatch();
            stopwatch.Start();
            
            var tasks = new List<Task>();
            for (int i = 0; i < count; i++)
            {
                tasks.Add(Task.Run(async () => await ProcessLockProvider.InvokeAsync(locker, name, ActionAsync)));
            }

            await Task.WhenAll(tasks);

            stopwatch.Stop();
            long process = stopwatch.ElapsedMilliseconds + 1;
            
            Assert.Equal(0, _processing);
            Assert.Equal(1, _simultaneous);
            Assert.True((_processed >= 1) && (_processed <= count));
            Assert.True(process >= ActionDelay, $"process:{process}, ActionDelay:{ActionDelay}");
            Assert.True(process < count * ActionDelay, $"process:{process}, count:{count}, ActionDelay:{ActionDelay}");
        }
        
        #endregion
        
        [Fact]
        public async Task InMemorySingleTest()
        {
            var  locker = new InMemoryProcessLocker();

            await SingleTestAsync(locker, nameof(InMemorySingleTest));
        }
        
        [Fact]
        public async Task InMemoryMultipleTest()
        {
            var  locker = new InMemoryProcessLocker();
            
            await MultipleTestAsync(locker, nameof(InMemoryMultipleTest));
        }
    }
}