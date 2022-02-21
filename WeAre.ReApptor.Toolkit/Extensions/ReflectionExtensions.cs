using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace WeAre.ReApptor.Toolkit.Extensions
{
    public static class ReflectionExtensions
    {
        private static readonly SortedList<int, Action<object, object>> Setters = new SortedList<int, Action<object, object>>();
        private static readonly SortedList<int, Func<object, object>> Getters = new SortedList<int, Func<object, object>>();
        private static readonly SortedList<int, FieldInfo> Fields = new SortedList<int, FieldInfo>();
        private static readonly SortedList<int, PropertyInfo> Properties = new SortedList<int, PropertyInfo>();
        private static readonly SortedList<int, MethodInfo> Methods = new SortedList<int, MethodInfo>();

        public static Action<object> BuildActionAccessor(this MethodInfo method)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            MethodCallExpression body = Expression.Call(Expression.Convert(instance, method.DeclaringType), method);
            Expression<Action<object>> expr = Expression.Lambda<Action<object>>(body, instance);
            return expr.Compile();
        }

        public static Action<object, T> BuildActionAccessor<T>(this MethodInfo method)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            ParameterExpression arg = Expression.Parameter(typeof(T));
            MethodCallExpression body = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, arg);
            Expression<Action<object, T>> expr = Expression.Lambda<Action<object, T>>(body, instance, arg);
            return expr.Compile();
        }

        public static Action<object, T1, T2> BuildActionAccessor<T1, T2>(this MethodInfo method)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            ParameterExpression arg1 = Expression.Parameter(typeof(T1), "arg1");
            ParameterExpression arg2 = Expression.Parameter(typeof(T2), "arg2");
            MethodCallExpression body = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, arg1, arg2);
            Expression<Action<object, T1, T2>> expr = Expression.Lambda<Action<object, T1, T2>>(body, instance, arg1, arg2);
            return expr.Compile();
        }

        public static Action<object, T1, T2, T3> BuildActionAccessor<T1, T2, T3>(this MethodInfo method)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            ParameterExpression arg1 = Expression.Parameter(typeof(T1), "arg1");
            ParameterExpression arg2 = Expression.Parameter(typeof(T2), "arg2");
            ParameterExpression arg3 = Expression.Parameter(typeof(T3), "arg3");
            MethodCallExpression body = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, arg1, arg2, arg3);
            Expression<Action<object, T1, T2, T3>> expr = Expression.Lambda<Action<object, T1, T2, T3>>(body, instance, arg1, arg2, arg3);
            return expr.Compile();
        }

        public static Action<object, T1, T2, T3, T4> BuildActionAccessor<T1, T2, T3, T4>(this MethodInfo method)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            ParameterExpression arg1 = Expression.Parameter(typeof(T1), "arg1");
            ParameterExpression arg2 = Expression.Parameter(typeof(T2), "arg2");
            ParameterExpression arg3 = Expression.Parameter(typeof(T3), "arg3");
            ParameterExpression arg4 = Expression.Parameter(typeof(T4), "arg4");
            MethodCallExpression body = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, arg1, arg2, arg3, arg4);
            Expression<Action<object, T1, T2, T3, T4>> expr = Expression.Lambda<Action<object, T1, T2, T3, T4>>(body, instance, arg1, arg2, arg3, arg4);
            return expr.Compile();
        }

        public static Func<object, T, TResult> BuildFuncAccessor<T, TResult>(this MethodInfo method)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            ParameterExpression arg = Expression.Parameter(typeof(T));
            MethodCallExpression call = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, arg);
            UnaryExpression body = Expression.Convert(call, typeof(TResult));
            Expression<Func<object, T, TResult>> expr = Expression.Lambda<Func<object, T, TResult>>(body, instance, arg);
            return expr.Compile();
        }

        public static Func<object, T1, T2, TResult> BuildFuncAccessor<T1, T2, TResult>(this MethodInfo method)
        {
            return BuildFuncAccessor<object, T1, T2, TResult>(method);
        }

        public static Func<TInstance, T1, T2, TResult> BuildFuncAccessor<TInstance, T1, T2, TResult>(this MethodInfo method) where TInstance : class
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(TInstance), "instance");
            ParameterExpression arg1 = Expression.Parameter(typeof(T1));
            ParameterExpression arg2 = Expression.Parameter(typeof(T2));
            MethodCallExpression call = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, arg1, arg2);
            UnaryExpression body = Expression.Convert(call, typeof(TResult));
            Expression<Func<object, T1, T2, TResult>> expr = Expression.Lambda<Func<object, T1, T2, TResult>>(body, instance, arg1, arg2);
            return expr.Compile();
        }

        public static Func<object, object, object> BuildFuncAccessor(this MethodInfo method, Type argumentType)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            ParameterExpression arg = Expression.Parameter(typeof(object));
            MethodCallExpression call = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, Expression.Convert(arg, argumentType));
            UnaryExpression body = Expression.Convert(call, typeof(object));
            Expression<Func<object, object, object>> expr = Expression.Lambda<Func<object, object, object>>(body, instance, arg);
            return expr.Compile();
        }

        public static Action<object, object> BuildActionAccessor(this MethodInfo method, Type argumentType)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression instance = Expression.Parameter(typeof(object), "instance");
            ParameterExpression arg = Expression.Parameter(typeof(object));
            MethodCallExpression body = Expression.Call(Expression.Convert(instance, method.DeclaringType), method, Expression.Convert(arg, argumentType));
            Expression<Action<object, object>> expr = Expression.Lambda<Action<object, object>>(body, instance, arg);
            return expr.Compile();
        }

        public static Func<object, object> BuildGetAccessor(this MethodInfo method)
        {
            if (method == null)
                throw new ArgumentNullException(nameof(method));
            if (method.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(method), "(method.DeclaringType == null)");

            ParameterExpression obj = Expression.Parameter(typeof(object), "obj");
            UnaryExpression body = Expression.Convert(Expression.Call(Expression.Convert(obj, method.DeclaringType), method), typeof(object));
            Expression<Func<object, object>> expr = Expression.Lambda<Func<object, object>>(body, obj);
            return expr.Compile();
        }

        public static Func<object, object> BuildGetAccessor(this FieldInfo field)
        {
            if (field == null)
                throw new ArgumentNullException(nameof(field));
            if (field.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(field), "(field.DeclaringType == null)");

            ParameterExpression obj = Expression.Parameter(typeof(object), "obj");
            Expression<Func<object, object>> expr = Expression.Lambda<Func<object, object>>(Expression.Convert(Expression.Field(Expression.Convert(obj, field.DeclaringType), field), typeof(object)), obj);
            return expr.Compile();
        }

        public static Action<object, object> BuildSetAccessor(this FieldInfo field)
        {
            if (field == null)
                throw new ArgumentNullException(nameof(field));
            if (field.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(field), "(field.DeclaringType == null)");

            var instance = Expression.Parameter(typeof(object), "i");
            var castedInstance = Expression.ConvertChecked(instance, field.DeclaringType);
            var argument = Expression.Parameter(typeof(object), "a");
            var setter = Expression.Assign(Expression.Field(castedInstance, field), Expression.Convert(argument, field.FieldType));
            return Expression.Lambda<Action<object, object>>(setter, instance, argument).Compile();
        }

        public static Func<object, object> BuildGetAccessor(this PropertyInfo property)
        {
            if (property == null)
                throw new ArgumentNullException(nameof(property));
            if (property.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(property), $"No declaring type for property \"{property.Name}\".");
            if (property.IsIndexProperty())
                throw new ArgumentOutOfRangeException(nameof(property), $"Property \"{property.Name}\" in \"{property.DeclaringType?.FullName}\" is index property.");

            ParameterExpression obj = Expression.Parameter(typeof(object), "obj");
            Expression<Func<object, object>> expr = Expression.Lambda<Func<object, object>>(Expression.Convert(Expression.Property(Expression.Convert(obj, property.DeclaringType!), property), typeof(object)), obj);
            return expr.Compile();
        }

        public static Action<object, object> BuildSetAccessor(this PropertyInfo property)
        {
            if (property == null)
                throw new ArgumentNullException(nameof(property));
            if (property.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(property), $"No declaring type for property \"{property.Name}\".");
            if (property.IsIndexProperty())
                throw new ArgumentOutOfRangeException(nameof(property), $"Property \"{property.Name}\" in \"{property.DeclaringType?.FullName}\" is index property.");
            if (property.IsStatic())
                throw new ArgumentOutOfRangeException(nameof(property), "Property \"{property.Name}\" in \"{property.DeclaringType?.FullName}\" is static.");

            ParameterExpression instance = Expression.Parameter(typeof(object), "i");
            UnaryExpression castedInstance = Expression.ConvertChecked(instance, property.DeclaringType!);
            var argument = Expression.Parameter(typeof(object), "a");
            var setter = Expression.Assign(Expression.Property(castedInstance, property), Expression.Convert(argument, property.PropertyType));
            return Expression.Lambda<Action<object, object>>(setter, instance, argument).Compile();
        }

        public static Action<object> BuildStaticSetAccessor(this PropertyInfo property)
        {
            if (property == null)
                throw new ArgumentNullException(nameof(property));
            if (property.DeclaringType == null)
                throw new ArgumentOutOfRangeException(nameof(property), "(property.DeclaringType == null)");
            if (!property.IsStatic())
                throw new ArgumentOutOfRangeException(nameof(property), "(!property.IsStatic())");

            var argument = Expression.Parameter(typeof(object), "argument");
            var setter = Expression.Assign(Expression.Property(null, property), Expression.Convert(argument, property.PropertyType));
            return Expression.Lambda<Action<object>>(setter, argument).Compile();
        }

        public static void SetValue<TInstance, TValue>(this FieldInfo field, TInstance instance, TValue value)
        {
            SetValue(field, (object)instance, (object)value);
        }

        public static void SetValue(this FieldInfo field, object instance, object value)
        {
            if (field == null)
                throw new ArgumentNullException(nameof(field));

            int hash = field.GetHashCode();
            Action<object, object> set;
            lock (Setters)
            {
                int index = Setters.IndexOfKey(hash);
                if (index != -1)
                {
                    set = Setters.Values[index];
                }
                else
                {
                    set = BuildSetAccessor(field);
                    Setters.Add(hash, set);
                }
            }

            set(instance, value);
        }

        public static TValue GetValue<TInstance, TValue>(this FieldInfo field, TInstance instance)
        {
            return (TValue)GetValue(field, instance);
        }

        public static object GetValue(this FieldInfo field, object instance)
        {
            if (field == null)
                throw new ArgumentNullException(nameof(field));

            int hash = field.GetHashCode();
            Func<object, object> get;
            lock (Setters)
            {
                int index = Getters.IndexOfKey(hash);
                if (index != -1)
                {
                    get = Getters.Values[index];
                }
                else
                {
                    get = BuildGetAccessor(field);
                    Getters.Add(hash, get);
                }
            }

            return get(instance);
        }

        public static void SetValue<TInstance, TValue>(this PropertyInfo property, TInstance instance, TValue value)
        {
            SetValue(property, (object)instance, (object)value);
        }

        public static void SetValue(PropertyInfo property, object instance, object value)
        {
            if (property == null)
                throw new ArgumentNullException(nameof(property));

            int hash = property.GetHashCode();
            Action<object, object> set;
            lock (Setters)
            {
                int index = Setters.IndexOfKey(hash);
                if (index != -1)
                {
                    set = Setters.Values[index];
                }
                else
                {
                    set = BuildSetAccessor(property);
                    Setters.Add(hash, set);
                }
            }

            set(instance, value);
        }

        public static void QuickSetValue(this PropertyInfo property, object instance, object value)
        {
            SetValue(property, instance, value);
        }

        public static object QuickGetValue(this PropertyInfo property, object instance)
        {
            return GetValue(property, instance);
        }

        public static TValue QuickGetValue<TValue>(this PropertyInfo property, object instance)
        {
            return (TValue)GetValue(property, instance);
        }

        public static TValue QuickGetValue<TInstance, TValue>(this PropertyInfo property, TInstance instance)
        {
            return (TValue)GetValue(property, instance);
        }

        public static object GetValue(PropertyInfo property, object instance)
        {
            if (property == null)
                throw new ArgumentNullException(nameof(property));

            int hash = property.GetHashCode();
            Func<object, object> get;
            lock (Getters)
            {
                int index = Getters.IndexOfKey(hash);
                if (index != -1)
                {
                    get = Getters.Values[index];
                }
                else
                {
                    get = BuildGetAccessor(property);
                    Getters.Add(hash, get);
                }
            }

            return get(instance);
        }

        public static FieldInfo GetField(Type type, string name, BindingFlags? bindings = null)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));
            if (name == null)
                throw new ArgumentNullException(nameof(name));
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentOutOfRangeException(nameof(name), "Field name is empty or whitespace.");

            bindings ??= DefaultBindings;

            string hash = $"{type.GetUniqueName()}:{name}:{bindings}";
            int key = hash.GetHashCode();

            lock (Fields)
            {
                int index = Fields.IndexOfKey(key);
                if (index != -1)
                {
                    return Fields.Values[index];
                }

                FieldInfo field = type.GetField(name, bindings.Value);

                if (field == null)
                    throw new ArgumentOutOfRangeException(nameof(name), $"Field with name \"{name}\" cannot be found in type \"{type.FullName}\" using bindings \"{bindings.Value}\".");

                Fields.Add(key, field);
                return field;
            }
        }

        public static PropertyInfo FindProperty(Type type, string name, BindingFlags? bindings = null)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));
            if (name == null)
                throw new ArgumentNullException(nameof(name));
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentOutOfRangeException(nameof(name), "Property name is empty or whitespace.");

            bindings ??= DefaultBindings;

            string hash = $"{type.GetUniqueName()}:{name}:{bindings}";
            int key = hash.GetHashCode();

            lock (Properties)
            {
                int index = Properties.IndexOfKey(key);
                if (index != -1)
                {
                    return Properties.Values[index];
                }

                PropertyInfo property = type.GetProperty(name, bindings.Value);

                Properties.Add(key, property);

                return property;
            }
        }

        public static PropertyInfo GetProperty(Type type, string name, BindingFlags? bindings = null)
        {
            bindings ??= DefaultBindings;

            PropertyInfo property = FindProperty(type, name, bindings);

            if (property == null)
                throw new ArgumentOutOfRangeException(nameof(name), $"Property with name \"{name}\" cannot be found in type \"{type.FullName}\" using bindings \"{bindings}\".");

            return property;
        }

        public static TValue GetFieldValue<TInstance, TValue>(this TInstance instance, string name, BindingFlags? bindings = null)
        {
            Type type = typeof(TInstance);
            FieldInfo field = GetField(type, name, bindings);
            TValue value = GetValue<TInstance, TValue>(field, instance);
            return value;
        }

        public static TValue GetPropertyValue<TInstance, TValue>(this TInstance instance, string name, BindingFlags? bindings = null)
        {
            Type type = typeof(TInstance);
            PropertyInfo property = GetProperty(type, name, bindings);
            var value = (TValue)GetValue(property, instance);
            return value;
        }

        public static TValue GetPropertyValue<TValue>(this object instance, string name, BindingFlags? bindings = null)
        {
            if (ReferenceEquals(instance, null))
                throw new ArgumentNullException(nameof(instance));

            Type type = instance.GetType();
            PropertyInfo property = GetProperty(type, name, bindings);
            var value = QuickGetValue<TValue>(property, instance);
            return value;
        }

        public static object GetPropertyValue(this object instance, string name, BindingFlags? bindings = null)
        {
            if (ReferenceEquals(instance, null))
                throw new ArgumentNullException(nameof(instance));

            Type type = instance.GetType();
            PropertyInfo property = GetProperty(type, name, bindings);
            object value = GetValue(property, instance);
            return value;
        }

        public static MethodInfo FindMethod(Type type, string name, BindingFlags? bindings = null)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));
            if (name == null)
                throw new ArgumentNullException(nameof(name));
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentOutOfRangeException(nameof(name), "Method name is empty or whitespace.");

            bindings ??= DefaultBindings;

            string hash = $"{type.GetUniqueName()}:{name}:{bindings}";
            int key = hash.GetHashCode();

            lock (Methods)
            {
                int index = Methods.IndexOfKey(key);
                if (index != -1)
                {
                    return Methods.Values[index];
                }

                MethodInfo method = type.GetMethod(name, bindings.Value);

                Methods.Add(key, method);

                return method;
            }
        }

        public static MethodInfo GetMethod(Type type, string name, BindingFlags? bindings = null)
        {
            MethodInfo method = FindMethod(type, name, bindings);

            bindings ??= DefaultBindings;

            if (method == null)
                throw new ArgumentOutOfRangeException(nameof(name), $"Method with name \"{name}\" cannot be found in type \"{type.FullName}\" using bindings \"{bindings}\".");

            return method;
        }

        public static void Invoke<TInstance>(this TInstance instance, string name, BindingFlags? bindings = null)
        {
            Type type = (!ReferenceEquals(instance, null)) ? instance.GetType() : typeof(TInstance);
            MethodInfo method = GetMethod(type, name, bindings);
            Action<object> accessor = BuildActionAccessor(method);
            accessor(instance);
        }

        public static void Invoke<TInstance, T1, T2>(this TInstance instance, string name, T1 arg1, T2 arg2, BindingFlags? bindings = null)
        {
            Type type = (!ReferenceEquals(instance, null)) ? instance.GetType() : typeof(TInstance);
            MethodInfo method = GetMethod(type, name, bindings);
            Action<object, T1, T2> accessor = BuildActionAccessor<T1, T2>(method);
            accessor(instance, arg1, arg2);
        }

        /// <summary>
        /// BindingFlags.Instance | BindingFlags.Public
        /// </summary>
        public static readonly BindingFlags DefaultBindings = BindingFlags.Instance | BindingFlags.Public;
    }
}
