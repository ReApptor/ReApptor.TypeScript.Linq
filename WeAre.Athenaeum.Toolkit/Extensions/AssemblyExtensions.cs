using System;
using System.Reflection;

namespace WeAre.Athenaeum.Toolkit.Extensions
{
    public static class AssemblyExtensions
    {
        public static byte[] Hash256(this Assembly assembly)
        {
            return Utility.Hash256(assembly);
        }

        public static string GetChecksum(this Assembly assembly)
        {
            return Utility.GetChecksum(assembly);
        }

        public static Guid GetRuntimeIdentifier(this Assembly assembly)
        {
            return Utility.GetRuntimeIdentifier(assembly);
        }
    }
}