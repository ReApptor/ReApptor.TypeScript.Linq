using System;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Renta.Toolkit.Extensions;

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
                
                services.AddSingleton(settings);
                
                Type[] optionsTypes = settings
                    .GetType()
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
    }
}