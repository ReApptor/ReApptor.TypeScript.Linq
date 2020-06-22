using System.Threading.Tasks;

namespace Renta.Toolkit.ProcessLocks
{
    public interface IProcessLocker
    {
        Task<ProcessLockState> GetStateAsync(string name);

        Task SetStateAsync(ProcessLockState state);
    }
}