using System.Reflection;

namespace WeAre.ReApptor.Toolkit.Extensions
{
    public static class PropertyInfoExtensions
    {
        public static bool IsStatic(this PropertyInfo property)
        {
            return Utility.IsStatic(property);
        }

        /// <summary>
        /// Tru if property is index property, like PropertyName[params args]
        /// </summary>
        public static bool IsIndexProperty(this PropertyInfo property)
        {
            return Utility.IsIndexProperty(property);
        }
    }
}