namespace Renta.Toolkit.ProcessLocks
{
    public enum ProcessLockAction
    {
        Timeout,
        
        Start,
        
        Skip,
        
        Complete
    }

    public enum ProcessLockStatus
    {
        Completed,
        
        Running
    }
}