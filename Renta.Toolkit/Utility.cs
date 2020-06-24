using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Renta.Toolkit.Attributes;
using Renta.Toolkit.Extensions;

namespace Renta.Toolkit
{
    public static class Utility
    {
        #region Private

        private static readonly SortedList<string, PropertyInfo[]> TypeProperties = new SortedList<string, PropertyInfo[]>();
        private static readonly SortedList<string, List<KeyValuePair<Assembly, Guid>>> AssembliesIdentifiers = new SortedList<string, List<KeyValuePair<Assembly, Guid>>>();
        private static readonly SortedList<Guid, byte[]> CacheAssemblyContentHash = new SortedList<Guid, byte[]>();

        private static object ToLocal(PropertyInfo instanceProperty, object instance, TimeZoneInfo defaultTimeZone, int? timezoneOffset = null)
        {
            if (instance != null)
            {
                if (instance is DateTime date)
                {
                    DateTime local = ToLocal(date, defaultTimeZone, timezoneOffset);
                    bool dateOnly = (instanceProperty.GetCustomAttribute<DateOnlyAttribute>() != null);
                    dateOnly |= local.IsDateOnly();
                    DateTime value = (dateOnly) ? local : date.AsUtc();
                    return value;
                }

                Type type = instance.GetType();

                if (!type.IsPrimitive)
                {
                    PropertyInfo[] properties = GetAllProperties(type);
                    foreach (PropertyInfo property in properties)
                    {
                        if ((property.CanRead) && (property.CanWrite))
                        {
                            object value = property.QuickGetValue(instance);
                            
                            object newValue = ToLocal(property, value, defaultTimeZone, timezoneOffset);
                            
                            if (newValue != value)
                            {
                                property.QuickSetValue(instance, newValue);
                            }
                        }
                    }
                }
            }

            return instance;
        }
        
        private static Type GetFullTypeDefinition(Type type)
        {
            return (type.IsGenericType) ? type.GetGenericTypeDefinition() : type;
        }

        private static bool VerifyGenericArguments(Type parent, Type child)
        {
            Type[] childArguments = child.GetGenericArguments();
            Type[] parentArguments = parent.GetGenericArguments();
            if (childArguments.Length == parentArguments.Length)
            {
                for (int i = 0; i < childArguments.Length; i++)
                {
                    Type childArgument = childArguments[i];
                    Type parentArgument = parentArguments[i];
                    
                    if ((childArgument.Assembly != parentArgument.Assembly) || (childArgument.Name != parentArgument.Name) || (childArgument.Namespace != parentArgument.Namespace))
                    {
                        if (!childArgument.IsSubclassOf(parentArgument))
                        {
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        #endregion

        #region Hash

        public static byte[] ContentHash256(Assembly assembly)
        {
            if (assembly == null)
                throw new ArgumentNullException(nameof(assembly));

            Guid assemblyRuntimeId = assembly.GetRuntimeIdentifier();

            lock (CacheAssemblyContentHash)
            {
                int index = CacheAssemblyContentHash.IndexOfKey(assemblyRuntimeId);

                if (index != -1)
                {
                    return CacheAssemblyContentHash.Values[index];
                }

                byte[] hash;
                var formatter = new BinaryFormatter();
                using (var stream = new MemoryStream())
                {
                    formatter.Serialize(stream, assembly);
                    hash = Hash256(stream);
                }

                CacheAssemblyContentHash.Add(assemblyRuntimeId, hash);

                return hash;
            }
        }

        public static byte[] Hash256(Assembly assembly)
        {
            if (assembly == null)
                throw new ArgumentNullException(nameof(assembly));

            byte[] hashCode;
            
            try
            {
                var hashEvidence = new Hash(assembly);
                hashCode = hashEvidence.SHA256;
            }
            catch (ArgumentException)
            {
                hashCode = ContentHash256(assembly);
            }
            
            return hashCode;
        }

        public static byte[] Hash256(string data, Encoding encoding = null)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            encoding ??= Encoding.UTF8;
            byte[] rawData = encoding.GetBytes(data);
            return Hash256(rawData);
        }

        public static byte[] Hash512(string data, Encoding encoding = null)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            encoding ??= Encoding.UTF8;
            byte[] rawData = encoding.GetBytes(data);
            return Hash512(rawData);
        }

        public static byte[] Hash1(string data, Encoding encoding = null)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            encoding ??= Encoding.UTF8;
            byte[] rawData = encoding.GetBytes(data);
            return Hash1(rawData);
        }

        public static byte[] Md5(string data, Encoding encoding = null)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            encoding ??= Encoding.UTF8;
            byte[] rawData = encoding.GetBytes(data);
            return Md5(rawData);
        }

        public static byte[] Hash256(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            using SHA256 sha = new SHA256Managed();
            return sha.ComputeHash(data);
        }

        public static byte[] Hash256(Stream data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            using SHA256 sha = new SHA256Managed();
            return sha.ComputeHash(data);
        }

        public static byte[] Hash512(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            using SHA512 sha = new SHA512Managed();
            return sha.ComputeHash(data);
        }

        public static byte[] Hash512(Stream data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            using SHA512 sha = new SHA512Managed();
            return sha.ComputeHash(data);
        }

        public static byte[] Hash1(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            using SHA1 sha = new SHA1Managed();
            return sha.ComputeHash(data);
        }

        public static byte[] Md5(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            using MD5 md5 = new MD5CryptoServiceProvider();
            return md5.ComputeHash(data);
        }

        public static Guid HashGuid(string data, Encoding encoding = null)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            encoding ??= Encoding.UTF8;
            byte[] rawData = encoding.GetBytes(data);
            return HashGuid(rawData);
        }

        public static Guid HashGuid(byte[] data)
        {
            byte[] hash = Md5(data);
            Guid id = new Guid(hash);
            return id;
        }

        #endregion

        #region Checksum

        public static string GetChecksum(Assembly assembly)
        {
            if (assembly == null)
                throw new ArgumentNullException(nameof(assembly));

            byte[] hash = Hash256(assembly);
            return ToHexString(hash);
        }

        public static string GetChecksum(string value)
        {
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            byte[] hash = Hash256(value);
            return ToHexString(hash);
        }

        public static string GetChecksum(byte[] value)
        {
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            byte[] hash = Hash256(value);
            return ToHexString(hash);
        }

        #endregion

        #region Copy

        public static byte[] Copy(byte[] from)
        {
            if (from == null)
            {
                return null;
            }

            var newAr = new byte[from.Length];
            from.CopyTo(newAr, 0);
            return newAr;
        }

        public static T[] Copy<T>(T[] from)
        {
            if (from == null)
            {
                return null;
            }

            var newAr = new T[from.Length];
            from.CopyTo(newAr, 0);
            return newAr;
        }

        #endregion

        #region Reflection

        public static PropertyInfo[] GetAllProperties(Type type, BindingFlags bindings = BindingFlags.Instance | BindingFlags.Public)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            string hashCode = $"{type.GetUniqueName()}:{bindings}";
            lock (TypeProperties)
            {
                int index = TypeProperties.IndexOfKey(hashCode);
                if (index != -1)
                {
                    return TypeProperties.Values[index];
                }

                PropertyInfo[] properties = type.GetProperties(bindings);
                TypeProperties.Add(hashCode, properties);
                return properties;
            }
        }

        public static bool IsSubClassOfGeneric(Type child, Type parent)
        {
            if (child == null)
                throw new ArgumentNullException(nameof(child));
            if (parent == null)
                throw new ArgumentNullException(nameof(parent));
            
            if (child == parent)
            {
                return false;
            }

            if (child.IsSubclassOf(parent))
            {
                return true;
            }

            Type[] parameters = parent.GetGenericArguments();

            Type parentFullTypeDefinition = GetFullTypeDefinition(parent);
            
            bool isParameterLessGeneric = !((parameters.Length > 0) && ((parameters[0].Attributes & TypeAttributes.BeforeFieldInit) == TypeAttributes.BeforeFieldInit));

            while ((child != null) && (child != typeof(object)))
            {
                Type current = GetFullTypeDefinition(child);

                if ((parent == current) || (isParameterLessGeneric && current.GetInterfaces().Select(GetFullTypeDefinition).Contains(parentFullTypeDefinition)))
                {
                    return true;
                }

                if (!isParameterLessGeneric)
                {
                    if ((parentFullTypeDefinition == current) && (!current.IsInterface))
                    {
                        if (VerifyGenericArguments(parentFullTypeDefinition, current))
                        {
                            if (VerifyGenericArguments(parent, child))
                            {
                                return true;
                            }
                        }
                    }
                    else
                    {
                        foreach (Type item in child.GetInterfaces().Where(subInterface => parentFullTypeDefinition == GetFullTypeDefinition(subInterface)))
                        {
                            if (VerifyGenericArguments(parent, item))
                            {
                                return true;
                            }
                        }
                    }
                }

                child = child.BaseType;
            }

            return false;
        }

        public static PropertyInfo[] GetAllProperties(Type type, Type propertyType, BindingFlags bindings = BindingFlags.Instance | BindingFlags.Public)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));
            if (propertyType == null)
                throw new ArgumentNullException(nameof(propertyType));

            string hashCode = $"{type.GetUniqueName()}:{bindings}:{propertyType.GetUniqueName()}";
            lock (TypeProperties)
            {
                int index = TypeProperties.IndexOfKey(hashCode);
                if (index != -1)
                {
                    return TypeProperties.Values[index];
                }

                PropertyInfo[] properties = GetAllProperties(type, bindings)
                    .Where(property => (property.PropertyType == propertyType) || (property.PropertyType.IsSubclassOf(propertyType)) || (property.PropertyType.IsSubClassOfGeneric(propertyType)))
                    .ToArray();

                TypeProperties.Add(hashCode, properties);
                return properties;
            }
        }

        public static PropertyInfo[] GetAllProperties<T>(Type type, BindingFlags bindings = BindingFlags.Instance | BindingFlags.Public)
        {
            return GetAllProperties(type, typeof(T), bindings);
        }

        public static Guid GetRuntimeIdentifier(Assembly assembly)
        {
            if (assembly == null)
                throw new ArgumentNullException(nameof(assembly));

            string key = (!string.IsNullOrWhiteSpace(assembly.FullName))
                ? assembly.FullName
                : "<dynamic>";
            
            lock (AssembliesIdentifiers)
            {
                List<KeyValuePair<Assembly, Guid>> items;
                KeyValuePair<Assembly, Guid> item;
                Guid id;

                int index = AssembliesIdentifiers.IndexOfKey(key);

                if (index == -1)
                {
                    id = Guid.NewGuid();
                    item = new KeyValuePair<Assembly, Guid>(assembly, id);
                    items = new List<KeyValuePair<Assembly, Guid>> {item};
                    AssembliesIdentifiers.Add(key, items);
                    return id;
                }

                items = AssembliesIdentifiers.Values[index];
                int count = items.Count;
                for (int i = 0; i < count; i++)
                {
                    item = items[i];
                    if (ReferenceEquals(item.Key, assembly))
                    {
                        return item.Value;
                    }
                }

                id = Guid.NewGuid();
                item = new KeyValuePair<Assembly, Guid>(assembly, id);
                items.Add(item);
                return id;
            }
        }

        public static bool IsStatic(PropertyInfo property)
        {
            if (property == null)
                throw new ArgumentNullException(nameof(property));

            if (property.CanRead)
            {
                MethodInfo methodGet = property.GetGetMethod() ?? property.GetGetMethod(true);
                if (methodGet != null)
                {
                    return methodGet.IsStatic;
                }
            }

            if (property.CanWrite)
            {
                MethodInfo methodSet = property.GetSetMethod() ?? property.GetSetMethod(true);
                if (methodSet != null)
                {
                    return methodSet.IsStatic;
                }
            }

            return false;
        }

        public static bool IsIndexProperty(PropertyInfo property)
        {
            if (property == null)
                throw new ArgumentNullException(nameof(property));

            return (property.GetIndexParameters().Length > 0);
        }

        public static string GetUniqueName(Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            Guid assemblyRuntimeId = type.Assembly.GetRuntimeIdentifier();
            string uniqueName = $"{assemblyRuntimeId}:{type.FullName}";
            return uniqueName;
        }

        public static string GetFullName(Type type, bool includeVersionAndToken = true)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            if (includeVersionAndToken)
            {
                //Example: System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=6.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089
                return type.AssemblyQualifiedName;
            }

            //Example: System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework
            string typeFullName = type.FullName;
            string assemblyName = type.Assembly.GetName().Name;
            string fullName = typeFullName + ", " + assemblyName;
            return fullName;
        }

        #endregion

        #region Byte Array

        public static byte[] ToByteArray(string data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));
            if (string.IsNullOrWhiteSpace(data))
                throw new ArgumentOutOfRangeException(nameof(data), "Data is empty or whitespace.");

            if (data.StartsWith("0x"))
            {
                data = data.Substring(2);
            }

            int length = data.Length;
            byte[] numArray = new byte[length / 2];
            int startIndex = 0;
            while (startIndex < length)
            {
                numArray[startIndex / 2] = Convert.ToByte(data.Substring(startIndex, 2), 16);
                startIndex += 2;
            }

            return numArray;
        }

        public static byte[] ToByteArray(Stream stream)
        {
            if (stream == null)
                throw new ArgumentNullException(nameof(stream));

            if (stream is MemoryStream memoryStream)
            {
                return memoryStream.ToArray();
            }

            if (stream.CanSeek)
            {
                stream.Seek(0L, SeekOrigin.Begin);
            }

            using var copy = new MemoryStream();
            stream.CopyTo(copy);
            return copy.ToArray();
        }

        public static async Task<byte[]> ToByteArrayAsync(Stream stream)
        {
            if (stream == null)
                throw new ArgumentNullException(nameof(stream));

            if (stream is MemoryStream memoryStream)
            {
                return memoryStream.ToArray();
            }

            if (stream.CanSeek)
            {
                stream.Seek(0L, SeekOrigin.Begin);
            }

            await using var copy = new MemoryStream();
            await stream.CopyToAsync(copy);
            return copy.ToArray();
        }

        public static string ToHexString(byte[] data)
        {
            if (data == null)
                throw new ArgumentNullException(nameof(data));

            int length = data.Length;
            var hex = new StringBuilder(length * 2);
            for (int i = 0; i < length; i++)
            {
                hex.AppendFormat("{0:X2}", data[i]);
            }

            return hex.ToString();
        }

        public static string ToHtmlImage(byte[] data)
        {
            return ToHtmlSrc(data, "image/png");
        }

        public static string ToHtmlCsv(byte[] data)
        {
            return ToHtmlSrc(data, "text/csv");
        }

        public static string ToHtmlSrc(byte[] data, string mimeType)
        {
            return ((data != null) && (data.Length > 0)) ? $"data:{mimeType};base64,{Convert.ToBase64String(data)}" : null;
        }

        public static bool IsEqual(byte[] x, byte[] y)
        {
            if (x == y)
            {
                return true;
            }

            if ((x == null) || (y == null) || (x.Length != y.Length))
            {
                return false;
            }

            for (int i = 0; i < x.Length; i++)
            {
                if (x[i] != y[i])
                {
                    return false;
                }
            }

            return true;
        }

        public static bool StartsWith(byte[] x, byte[] y)
        {
            if (x == y)
            {
                return true;
            }

            if ((x == null) || (y == null) || (x.Length < y.Length))
            {
                return false;
            }

            for (int i = 0; i < y.Length; i++)
            {
                if (x[i] != y[i])
                {
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Removes UTF file preamble (BOM)
        /// </summary>
        public static byte[] RemoveBomPreamble(byte[] value)
        {
            if (value == null)
            {
                return null;
            }

            byte[] preamble = Encoding.UTF8.GetPreamble();
            bool hasPreamble = (value.Length >= preamble.Length) && (value.StartsWith(preamble));

            byte[] rawData;
            if (hasPreamble)
            {
                rawData = new byte[value.Length - preamble.Length];
                Array.Copy(value, preamble.Length, rawData, 0, value.Length - preamble.Length);
            }
            else
            {
                rawData = new byte[value.Length];
                Array.Copy(value, rawData, value.Length);
            }

            return rawData;
        }

        #endregion

        #region Exception

        public static string ToTraceString(Exception ex, bool addNewLine = true)
        {
            var cr = (addNewLine) ? Environment.NewLine : string.Empty;
            if (ex == null)
            {
                return string.Empty;
            }

            string message = ex.Message;
            if (!addNewLine)
            {
                message = message
                    .Replace(Environment.NewLine, string.Empty)
                    .Replace("\r\n", string.Empty)
                    .Replace("\n", string.Empty);
            }

            message = $"Message: '{message}' {cr}Type: {ex.GetType()}{cr}";
            string stackTrace = ex.StackTrace;
            if (!string.IsNullOrWhiteSpace(stackTrace))
            {
                stackTrace = stackTrace.Trim();
                if (!addNewLine)
                {
                    stackTrace = stackTrace
                        .Replace(Environment.NewLine, string.Empty)
                        .Replace("\r\n", string.Empty)
                        .Replace("\n", string.Empty);
                }

                message += $" StackTrace:{cr}  {stackTrace}{cr}";
            }

            if (ex.InnerException != null)
            {
                message += $" InnerException:{cr}{ex.InnerException.ToTraceString(addNewLine)}";
            }

            message = message.Trim();
            message += cr;
            return message;
        }

        public static Exception GetActualException(Exception ex)
        {
            return ((ex as TargetInvocationException)?.InnerException) ?? ex;
        }

        #endregion

        #region Url File format

        public static byte[] ExtractRawDataFromUrl(string src)
        {
            if (!string.IsNullOrWhiteSpace(src))
            {
                int index = src.LastIndexOf("base64,", StringComparison.InvariantCultureIgnoreCase);
                if (index != -1)
                {
                    string base64 = src.Substring(index + 7).Trim();
                    if (!string.IsNullOrWhiteSpace(base64))
                    {
                        byte[] rawData = Convert.FromBase64String(base64);
                        return rawData;
                    }
                }
            }

            return null;
        }

        #endregion

        #region DateTime

        public static TimeZoneInfo GetTimeZone(params string[] names)
        {
            ReadOnlyCollection<TimeZoneInfo> timezones = TimeZoneInfo.GetSystemTimeZones();
            bool timezonesConfigured = (timezones.Count > 0);
            
            if ((timezonesConfigured) && (names != null) && (names.Length > 0))
            {
                foreach (string name in names)
                {
                    if (!string.IsNullOrWhiteSpace(name))
                    {
                        TimeZoneInfo timezone = timezones.FirstOrDefault(item => item.Id == name || item.DisplayName == name || item.StandardName == name);
                        if (timezone != null)
                        {
                            return timezone;
                        }
                    }
                }
            }

            string namesStr = (names ?? new[] {"\"not_specified\""}).Join(", ", item => $"\"{item}\"");
            string availableNamesStr = (timezonesConfigured) ? timezones.Join(", ", item => $"\"{item.StandardName}\" ({item.Id})") : "\"not_configured\"";
            throw new ArgumentOutOfRangeException(nameof(names), $"TimeZone with name(s) {namesStr} cannot be found, available timezones: {availableNamesStr}.");
        }

        public static DateTime ToLocal(DateTime date, int? timezoneOffset = null)
        {
            if (date.Kind == DateTimeKind.Local)
            {
                return date;
            }

            if (date.Kind == DateTimeKind.Unspecified)
            {
                date = new DateTime(date.Ticks, DateTimeKind.Local);
            }

            if (timezoneOffset == null)
            {
                return date.ToLocalTime();
            }

            date = date.AddMinutes(timezoneOffset.Value);

            return date;
        }
        
        public static DateTime ToLocal(DateTime date, TimeZoneInfo defaultTimeZone, int? timezoneOffset = null)
        {
            if ((defaultTimeZone != null) && (timezoneOffset != null))
            {
                bool todayIsWinterTime = (!defaultTimeZone.IsDaylightSavingTime(DateTime.Now));
                bool dayIsSummerTime = (defaultTimeZone.IsDaylightSavingTime(date));
                bool compensateDaylightSavingTime = todayIsWinterTime && dayIsSummerTime;
                if (compensateDaylightSavingTime)
                {
                    timezoneOffset += 60;
                }
                
                return ToLocal(date, timezoneOffset);
            }

            return date;
        }

        public static object ToLocal(object instance, TimeZoneInfo defaultTimeZone, int? timezoneOffset = null)
        {
            return ToLocal(null, instance, defaultTimeZone, timezoneOffset);
        }

        public static TimeSpan GetTimezoneOffset(TimeZoneInfo timezone = null)
        {
            DateTime utcNow = DateTime.UtcNow;
            DateTime now = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timezone ?? TimeZoneInfo.Local);
            TimeSpan timezoneOffset = (now - utcNow);
            return timezoneOffset;
        }

        #endregion

        #region Compress

        public static async Task<MemoryStream> CompressAsync(Stream data, bool deflate = true)
        {
            if (data == null)
            {
                return null;
            }

            const int bufferSize = 262144;

            var result = new MemoryStream();

            await using var compressor = (deflate)
                ? (Stream) new DeflateStream(result, CompressionMode.Compress, true)
                : new GZipStream(result, CompressionMode.Compress, true);
            
            await using var buffer = new BufferedStream(compressor, bufferSize);
                
            await data.CopyToAsync(buffer);

            result.Position = 0;

            return result;
        }

        public static async Task<MemoryStream> DecompressAsync(Stream compressed, bool deflate = true)
        {
            if (compressed == null)
            {
                return null;
            }

            const int bufferSize = 262144;

            await using var compressor = (deflate)
                ? (Stream) new DeflateStream(compressed, CompressionMode.Decompress, true)
                : new GZipStream(compressed, CompressionMode.Decompress, true);
            
            await using var buffer = new BufferedStream(compressor, bufferSize);
            
            var result = new MemoryStream();
            
            await buffer.CopyToAsync(result);
            
            result.Position = 0;
            
            return result;
        }

        public static async Task<byte[]> CompressAsync(byte[] data)
        {
            data ??= new byte[0];

            await using var compressed = new MemoryStream();

            await using var deflate = new DeflateStream(compressed, CompressionMode.Compress);
            
            await deflate.WriteAsync(data, 0, data.Length);

            return await compressed.ToByteArrayAsync();
        }

        public static async Task<byte[]> DecompressAsync(byte[] data)
        {
            data ??= new byte[0];
            
            await using var compressed = new MemoryStream(data);
            
            await using var deflate = new DeflateStream(compressed, CompressionMode.Decompress);
                
            await using var result = new MemoryStream();
                    
            await deflate.CopyToAsync(result);
                        
            return await result.ToByteArrayAsync();
        }

        public static async Task<string> Compress(string data)
        {
            if (string.IsNullOrEmpty(data))
            {
                return data;
            }

            byte[] rawData = Encoding.UTF8.GetBytes(data);
            
            rawData = await CompressAsync(rawData);
            
            return Convert.ToBase64String(rawData);
        }

        public static async Task<string> Decompress(string data)
        {
            if (String.IsNullOrEmpty(data))
            {
                return data;
            }

            byte[] rawData = Convert.FromBase64String(data);
            rawData = await DecompressAsync(rawData);
            
            return Encoding.UTF8.GetString(rawData);
        }

        #endregion
        
        #region Re-Try

        public static async Task InvokeAsync(Func<Task> action, int attempts = 1, int delay = 100)
        {
            async Task<bool> Invoker()
            {
                await action();
                return true;
            }

            await InvokeAsync(Invoker, attempts, delay);
        }

        public static async Task<T> InvokeAsync<T>(Func<Task<T>> action, int attempts = 1, int delay = 100)
        {
            if (attempts <= 0)
            {
                return await action();
            }

            while (true)
            {
                attempts--;
                
                try
                {
                    return await action();
                }
                catch (Exception)
                {
                    if (attempts == 0)
                    {
                        throw;
                    }

                    if (delay > 0)
                    {
                        await Task.Delay(delay);
                    }
                }
            }
        }

        #endregion
        
        #region String
        
        /// <summary>
        /// Removes UTF file preamble (BOM)
        /// </summary>
        public static string RemoveBomPreamble(string value)
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                byte[] preambleRaw = Encoding.UTF8.GetPreamble();
                string preamble = Encoding.UTF8.GetString(preambleRaw);
                if (value.StartsWith(preamble))
                {
                    value = value.Substring(preamble.Length);
                }
            }

            return value;
        }

        public static double ToDouble(string value)
        {
            try
            {
                return double.Parse(value);
            }
            catch (Exception)
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    string separator = Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator;

                    value = value
                        .Trim()
                        .Replace(" ", string.Empty)
                        .Replace(".", separator)
                        .Replace(",", separator);

                    if (double.TryParse(value, out double parsed))
                    {
                        return parsed;
                    }
                }

                throw;
            }
        }

        #endregion
    }
}