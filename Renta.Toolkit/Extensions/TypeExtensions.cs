using System;
using System.Reflection;

namespace Renta.Toolkit.Extensions
{
    public static class TypeExtensions
    {
        public static PropertyInfo[] GetAllProperties(this Type type, BindingFlags bindings = BindingFlags.Instance | BindingFlags.Public)
        {
            return Utility.GetAllProperties(type, bindings);
        }

        /// <summary>
        /// Generates process and assembly instance dependent name of specified type.
        /// </summary>
        public static string GetUniqueName(this Type type)
        {
            return Utility.GetUniqueName(type);
        }
        
        public static string GetFullName(this Type type, bool includeVersionAndToken = true)
        {
            return Utility.GetFullName(type, includeVersionAndToken);
        }
    }
}