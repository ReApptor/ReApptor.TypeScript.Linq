using System.Threading.Tasks;

namespace WeAre.ReApptor.Toolkit.ProcessLocks
{
    public interface IProcessLocker
    {
        Task<ProcessLockState> GetStateAsync(string name);

        Task SetStateAsync(ProcessLockState state);
    }
}