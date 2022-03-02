using System;

namespace WeAre.Apps.Common.Interfaces
{
    public interface IRemovable
    {
        bool Deleted { get; set; }
        
        DateTime? DeletedAt { get; set; }
    }
}