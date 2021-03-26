using System;
using Amazon.XRay.Recorder.Handlers.System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Renta.TestApplication.WebUI.Server.Providers;
using WeAre.Athenaeum.Common.Configuration;
using WeAre.Athenaeum.Common.Filters;
using WeAre.Athenaeum.Common.Helpers;
using WeAre.Athenaeum.Common.Middlewares;
using WeAre.Athenaeum.Common.Providers;
using WeAre.Athenaeum.TemplateApp.Common;
using WeAre.Athenaeum.TemplateApp.Common.Configuration;
using WeAre.Athenaeum.TemplateApp.WebUI.Server.Middlewares;
using WebEssentials.AspNetCore.Pwa;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace Renta.TestApplication.WebUI
{
    public class Startup
    {
        public Startup(IConfiguration configuration, ILogger<Startup> logger)
        {
            Configuration = configuration;
            Logger = logger;
        }

        // ReSharper disable once MemberCanBePrivate.Global
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public IConfiguration Configuration { get; }

        // ReSharper disable once MemberCanBePrivate.Global
        public ILogger<Startup> Logger { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var configuration = services.AddAthenaeumConfiguration<TestApplicationConfiguration>();

            ConfigureServices(services, configuration);
        }

        private void ConfigureServices(IServiceCollection services, TestApplicationConfiguration configuration)
        {
            services.AddHttpContextAccessor();

            services.AddOptions();

            AddSecurity(services, configuration);

            ConfigureCookies(services);

            AddApiClients(services, configuration);

            AddSpa(services);

            AddDataProtection(services, configuration);

            AddRedisSession(services, configuration);
            
            //AddHealthCheck(services);

            AddMvc(services);

            AddPwa(services, configuration);
        }
        
        // private static void AddHealthCheck(IServiceCollection services)
        // {
        //     services.AddScoped<BackendHealthCheck>();
        //
        //     services.AddHealthChecks()
        //         .AddCheck<BackendHealthCheck>(nameof(BackendHealthCheck));
        // }

        private static void AddSecurity(IServiceCollection services, TestApplicationConfiguration configuration)
        {
            services.AddSingleton<TokenProvider>();
            
            services.AddScoped<HttpContextProvider, WebHttpContextProvider>();

            services.AddSecurityProvider();

            services.AddAthenaeumConfiguration<TestApplicationConfiguration>();
        }

        private static void ConfigureCookies(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
        }

        private static void AddApiClient<TClient>(IServiceCollection services, Uri endpoint, TestApplicationConfiguration configuration) where TClient : class
        {
            if (!configuration.IsDevelopmentVS)
            {
                services
                    .AddHttpClient<TClient>(client => { client.BaseAddress = endpoint; })
                    .AddHttpMessageHandler<ApiRequestHandler>()
                    .AddHttpMessageHandler<HttpClientXRayTracingHandler>();
            }
            else
            {
                services
                    .AddHttpClient<TClient>(client => { client.BaseAddress = endpoint; })
                    .AddHttpMessageHandler<ApiRequestHandler>();
            }
        }

        private void AddApiClients(IServiceCollection services, TestApplicationConfiguration configuration)
        {
            // Logger.LogInformation($"Dynamically initializing of application controller with type \"{typeof(ApplicationController)}\" to avoid reflection optimization.");
            //
            // var endpoint = new Uri(configuration.ApiUrl);
            // services.AddTransient<HttpClientXRayTracingHandler>();
            // services.AddTransient<ApiRequestHandler>();
            //
            // AddApiClient<NotificationApiClient>(services, endpoint, configuration);
            // AddApiClient<SystemApiClient>(services, endpoint, configuration);
            // AddApiClient<UserApiClient>(services, endpoint, configuration);
            // AddApiClient<OrganizationApiClient>(services, endpoint, configuration);
        }

        private static void AddSpa(IServiceCollection services)
        {
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(spaConfiguration => { spaConfiguration.RootPath = "./build"; });
        }

        private static void AddMvc(IServiceCollection services)
        {
            services.AddLocalization(options => options.ResourcesPath = "../WeAre.Athenaeum.TemplateApp.WebUI.Resources/Resources");
            
            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = TestApplicationConstants.DefaultRequestCulture;
                options.SupportedCultures = TestApplicationConstants.SupportedCultures;
                options.SupportedUICultures = TestApplicationConstants.SupportedCultures;
            });

            services.AddAntiforgery(options =>
            {
                options.HeaderName = TestApplicationConstants.XsrfTokenName;
                options.SuppressXFrameOptionsHeader = false;
            });
            
            services
                .AddMvc(option => option.EnableEndpointRouting = false)
                .AddNewtonsoftJson()
                .SetCompatibilityVersion(CompatibilityVersion.Latest);
        }

        private static void AddPwa(IServiceCollection services, TestApplicationConfiguration configuration)
        {
            services.AddProgressiveWebApp(new PwaOptions
            {
                RegisterServiceWorker = false,
                RegisterWebmanifest = false,
                Strategy = ServiceWorkerStrategy.NetworkFirst,
                CacheId = configuration.Version
            });
        }

        private static void AddDataProtection(IServiceCollection services, TestApplicationConfiguration configuration)
        {
            services
                .AddDataProtection()
                .SetApplicationName(TestApplicationConstants.ApplicationName)
                .DisableAutomaticKeyGeneration()
                .AddKeyManagementOptions(options => { options.XmlRepository = new ConfigurationXmlRepository(configuration.DataProtectionKey); });
        }

        private static void AddRedisSession(IServiceCollection services, TestApplicationConfiguration configuration)
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.InstanceName = configuration.RedisSettings.SessionName;
                options.Configuration = configuration.RedisSettings.Host;
            });

            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(configuration.SessionTimeoutMinutes);
                //Does not need user confirmation to store cookies
                //options.Cookie.IsEssential = true;
                //options.Cookie.HttpOnly = true;
                //options.Cookie.MaxAge = TimeSpan.FromMinutes(configuration.SessionTimeoutMinutes + 1);
                //options.Cookie.Expiration = TimeSpan.FromMinutes(configuration.SessionTimeoutMinutes);
                //options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, TestApplicationConfiguration configuration)
        {
            Logger.LogEnvironmentInformation(configuration);
            
            ThreadPoolHelper.ConfigureMinThreads(configuration.CoresPerServer, Logger);

            app.UseRequestLocalization();

            if (!configuration.IsDevelopmentVS)
            {
                //var forwardedHeadersOptions = new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedProto };
                //forwardedHeadersOptions.KnownNetworks.Clear();
                //forwardedHeadersOptions.KnownProxies.Clear();
                //app.UseForwardedHeaders(forwardedHeadersOptions);
                app.UseMiddleware<XForwardedRequestMiddleware>();

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
                app.UseHttpsRedirection();
            }
            
            if (!configuration.IsDevelopmentVS)
            {
                app.UseXRay(configuration.FrontendInstanceName);
            }

            app.UseSpaStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = responseContext =>
                {
                    // Cache all static resources for 1 year (versioned filenames)
                    ResponseHeaders headers = responseContext.Context.Response.GetTypedHeaders();
                    headers.CacheControl = new CacheControlHeaderValue
                    {
                        Public = true,
                        MaxAge = TimeSpan.FromDays(365)
                    };
                }
            });
            
            // app.UseHealthChecks("/health", new HealthCheckOptions
            // {
            //     // WriteResponse is a delegate used to write the response.
            //     ResponseWriter = WriteResponse
            // });
            
            app.UseSession();

            app.UseAuthentication();
            
            app.UseApiExceptionMiddleware();

            app.UseMvc();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = ".";

                if (configuration.IsDevelopmentVS)
                {
                    spa.UseReactDevelopmentServer("start");
                }
            });
            
            Logger.LogInformation($"Startup WebUI on \"{Environment.MachineName}\" initialized.");
        }
        
        // private static Task WriteResponse(HttpContext httpContext, HealthReport result)
        // {
        //     httpContext.Response.ContentType = TestApplicationConstants.Http.ApiContextType;
        //
        //     var json = new JObject(
        //         new JProperty("status", result.Status.ToString()),
        //         new JProperty("results", new JObject(result.Entries.Select(pair =>
        //             new JProperty(pair.Key, new JObject(
        //                 new JProperty("status", pair.Value.Status.ToString()),
        //                 new JProperty("description", pair.Value.Description),
        //                 new JProperty("data", new JObject(pair.Value.Data.Select(
        //                     p => new JProperty(p.Key, p.Value))))))))));
        //     
        //     return httpContext.Response.WriteAsync(json.ToString(Formatting.Indented));
        // }
    }
}