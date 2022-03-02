using System;

namespace WeAre.ReApptor.Toolkit.ProcessLocks
{
    public sealed class ProcessLockMessage
    {
        public string Name { get; set; }
        
        public ProcessLockAction Action { get; set; }
        
        public DateTime? Timestamp { get; set; }
    }
}