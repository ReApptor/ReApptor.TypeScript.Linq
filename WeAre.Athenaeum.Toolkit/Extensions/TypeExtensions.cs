using System;
using System.Reflection;

namespace WeAre.Athenaeum.Toolkit.Extensions
{
    public static class TypeExtensions
    {
        public static PropertyInfo[] GetAllProperties(this Type type, BindingFlags bindings = BindingFlags.Instance | BindingFlags.Public)
        {
            return Utility.GetAllProperties(type, bindings);
        }

        public static PropertyInfo[] GetAllProperties(this Type type, Type propertyType, BindingFlags bindings = BindingFlags.Instance | BindingFlags.Public)
        {
            return Utility.GetAllProperties(type, propertyType, bindings);
        }

        public static PropertyInfo[] GetAllProperties<T>(this Type type, BindingFlags bindings = BindingFlags.Instance | BindingFlags.Public)
        {
            return Utility.GetAllProperties<T>(type, bindings);
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
        
        public static bool IsSubClassOfGeneric(this Type type, Type parent)
        {
            return Utility.IsSubClassOfGeneric(type, parent);
        }
        
        public static bool IsSubClassOfGeneric<T>(this Type type)
        {
            return Utility.IsSubClassOfGeneric(type, typeof(T));
        }
    }
}