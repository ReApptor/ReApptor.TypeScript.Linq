using Microsoft.Extensions.Options;

namespace WeAre.ReApptor.Common.Middlewares.EternalCache
{
    public sealed class EternalCacheMiddlewareOptions : IOptions<EternalCacheMiddlewareOptions>
    {
        public string Route { get; set; }
        
        EternalCacheMiddlewareOptions IOptions<EternalCacheMiddlewareOptions>.Value => this;
    }
}