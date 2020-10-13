using System;

namespace WeAre.Athenaeum.Toolkit.ProcessLocks
{
    public sealed class ProcessLockState
    {
        public string Name { get; set; }

        public DateTime? StartAt { get; set; }

        public DateTime? EndAt { get; set; }

        public DateTime? Timestamp { get; set; }

        public ProcessLockStatus Status { get; set; }
    }
}