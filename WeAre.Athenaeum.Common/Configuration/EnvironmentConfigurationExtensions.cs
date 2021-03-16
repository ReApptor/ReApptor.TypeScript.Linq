﻿using System;
using System.Globalization;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using WeAre.Athenaeum.Common.Providers;
using WeAre.Athenaeum.Toolkit.Extensions;

namespace WeAre.Athenaeum.Common.Configuration
{
    public static class EnvironmentConfigurationExtensions
    {
        public static TConfiguration AddAthenaeumConfiguration<TConfiguration>(this IServiceCollection services) where TConfiguration : BaseEnvironmentConfiguration<TConfiguration>
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));

            services.AddSingleton<TConfiguration>();

            TConfiguration configuration = services.BuildServiceProvider().GetService<TConfiguration>();
            
            services.AddSingleton<IEnvironmentConfiguration>(configuration);

            Type optionsGenericType = typeof(IOptions<>);

            PropertyInfo[] settingsProperties = typeof(TConfiguration).GetAllProperties(optionsGenericType);

            foreach (PropertyInfo settingsProperty in settingsProperties)
            {
                object settings = settingsProperty.QuickGetValue(configuration);

                Type settingsType = settings.GetType();

                services.AddSingleton(settingsType, settings);

                Type[] optionsTypes = settingsType
                    .GetInterfaces()
                    .Where(item => item.IsSubClassOfGeneric(optionsGenericType))
                    .ToArray();

                foreach (Type optionsType in optionsTypes)
                {
                    services.AddSingleton(optionsType, settings);
                }
            }

            return configuration;
        }

        public static void AddAthenaeumLocalization(this IServiceCollection services, CultureInfo[] supportedCultures, CultureInfo defaultCulture, string country, bool requestBased = true)
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));
            if (supportedCultures == null)
                throw new ArgumentNullException(nameof(supportedCultures));

            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
                options.DefaultRequestCulture = HttpContextRequestCultureProvider.GetCultureRequest(supportedCultures, country, defaultCulture);

                options.RequestCultureProviders.Clear();
                if (requestBased)
                {
                    options.RequestCultureProviders.Add(HttpContextRequestCultureProvider.Instance);
                }
            });
        }
    }
}