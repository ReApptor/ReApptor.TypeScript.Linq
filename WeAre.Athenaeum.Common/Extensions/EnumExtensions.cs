using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace WeAre.Athenaeum.Common.Extensions
{
    public static class EnumExtensions
    {
        public static string GetEnumName<T>(this T enumValue) where T : struct
        {
            Type type = enumValue.GetType();

            if (!type.IsEnum)
                throw new ArgumentOutOfRangeException(nameof(enumValue), $"Type \"{type.FullName}\" is not enum.");

            string enumIntValue = enumValue.ToString();

            MemberInfo memberInfo = type.GetMember(enumIntValue ?? string.Empty).FirstOrDefault();

            if (memberInfo == null)
                throw new ArgumentOutOfRangeException(nameof(enumValue), $"Enum value \"{enumIntValue}\" cannot be found in enum type \"{type.FullName}\".");

            var enumMember = memberInfo.GetCustomAttribute<EnumMemberAttribute>();

            if (!string.IsNullOrWhiteSpace(enumMember?.Value))
            {
                return enumMember.Value;
            }

            var jsonProperty = memberInfo.GetCustomAttribute<JsonPropertyAttribute>();

            if (!string.IsNullOrWhiteSpace(jsonProperty?.PropertyName))
            {
                return jsonProperty.PropertyName;
            }

            return memberInfo.Name;
        }
    }
}