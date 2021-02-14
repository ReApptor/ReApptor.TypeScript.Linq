using System;
using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using WeAre.Athenaeum.TemplateApp.WebUI.Server.Models;

namespace WeAre.Athenaeum.TemplateApp.WebUI.Server.Extensions
{
    public static class SessionExtensions
    {
        #region Private

        #region Constants

        private const string ApplicationContextKey = "ApplicationContext";
        private const string UserContextKey = "UserContext";

        #endregion

        private static byte[] Serialize(object value)
        {
            string json = JsonConvert.SerializeObject(value);
            return Encoding.UTF8.GetBytes(json);
        }

        private static T Deserialize<T>(byte[] data)
        {
            string json = Encoding.UTF8.GetString(data);
            return JsonConvert.DeserializeObject<T>(json);
        }

        private static void SetData(this ISession session, string key, byte[] data)
        {
            if (session == null)
                throw new ArgumentNullException(nameof(session));

            if (data != null)
            {
                session.Set(key, data);
            }
            else
            {
                session.Remove(key);
            }
        }

        private static byte[] GetData(this ISession session, string key)
        {
            if (session.TryGetValue(key, out byte[] data))
            {
                return data;
            }

            return null;
        }

        #endregion

        #region Public

        #region Object

        public static void SetObject(this ISession session, string key, object value)
        {
            byte[] data = (value != null) ? Serialize(value) : null;
            session.SetData(key, data);
        }

        public static T GetObject<T>(this ISession session, string key, bool create = false)
        {
            if (session == null)
                throw new ArgumentNullException(nameof(session));

            byte[] data = session.GetData(key);
            if (data != null)
            {
                var value = Deserialize<T>(data);
                return value;
            }

            if (create)
            {
                T value = Activator.CreateInstance<T>();
                session.SetObject(key, value);
                return value;
            }

            return default(T);
        }

        #endregion

        #region Bool


        public static void Set(this ISession session, string key, bool value)
        {
            session.SetObject(key, value);
        }

        public static bool GetBool(this ISession session, string key, bool clear = false)
        {
            var value = session.GetObject<bool>(key, true);

            if (clear)
            {
                session.Remove(key);
            }

            return value;
        }

        #endregion

        #region Guid

        public static void Set(this ISession session, string key, Guid? value)
        {
            session.SetObject(key, value);
        }

        public static Guid? GetGuid(this ISession session, string key, bool clear = false)
        {
            var value = session.GetObject<Guid?>(key, true);

            if (clear)
            {
                session.Remove(key);
            }

            return value;
        }

        #endregion

        #region DateTime

        public static void Set(this ISession session, string key, DateTime value)
        {
            session.SetObject(key, value);
        }

        public static DateTime? GetDateTime(this ISession session, string key, bool clear = false)
        {
            var value = session.GetObject<DateTime?>(key, true);

            if (clear)
            {
                session.Remove(key);
            }

            return value;
        }

        #endregion

        #region User Scope

        public static void Set(this ISession session, ApplicationContext context)
        {
            if (context != null)
            {
                if (context is UserContext)
                {
                    session.SetObject(UserContextKey, context);
                    session.SetObject(ApplicationContextKey, null);
                }
                else
                {
                    session.SetObject(ApplicationContextKey, context);
                    session.SetObject(UserContextKey, null);
                }
            }
            else
            {
                session.Set(ApplicationContextKey, null);
                session.Set(UserContextKey, null);
            }
        }

        /// <summary>
        /// Returns user specific data from HttpContext.Session.
        /// Can return null if no scope for user.
        /// </summary>
        public static ApplicationContext GetContext(this ISession session)
        {
            return session.GetObject<UserContext>(UserContextKey) ?? session.GetObject<ApplicationContext>(ApplicationContextKey);
        }

        #endregion

        #endregion
    }
}
