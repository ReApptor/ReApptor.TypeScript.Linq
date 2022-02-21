using System;

namespace WeAre.ReApptor.Toolkit.Attributes
{
    /// <summary>
    /// Specify DateTime item (property, field or parameter) has date only (without time), doesn't need timezone conversion
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
    public sealed class DateOnlyAttribute : Attribute
    {
    }
}