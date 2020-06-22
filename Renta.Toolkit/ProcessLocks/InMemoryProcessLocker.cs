using System.Collections.Generic;
using System.Threading.Tasks;

namespace Renta.Toolkit.ProcessLocks
{
    public sealed class InMemoryProcessLocker : IProcessLocker
    {
        private static readonly Dictionary<string, ProcessLockState> States = new Dictionary<string, ProcessLockState>();

        private static string GetName(string name)
        {
            return (!string.IsNullOrWhiteSpace(name))
                ? name
                : "global";
        }

        public async Task<ProcessLockState> GetStateAsync(string name)
        {
            name = GetName(name);
            ProcessLockState state;

            lock (States)
            {
                state = (States.ContainsKey(name)) ? States[name] : null;
            }

            return await Task.FromResult(state);
        }

        public async Task SetStateAsync(ProcessLockState state)
        {
            string name = GetName(state.Name);
            
            lock (States)
            {
                if (States.ContainsKey(name))
                {
                    States[name] = state;
                }
                else
                {
                    States.Add(name, state);
                }
            }

            await Task.FromResult(0);
        }
    }
}