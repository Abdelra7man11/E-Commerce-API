using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using ServiceAbstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Attributes
{
    class RedisCacheAttribute(int durationInSec = 1800) : ActionFilterAttribute
    {
        public async override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Create CacheKey  
            string CacheKey = CreateCacheKey(context.HttpContext.Request);

            // Search For Value With Cache Key
            ICacheService cacheService = context.HttpContext.RequestServices.GetRequiredService<ICacheService>();
            var cacheValue = await cacheService.GetAsync(CacheKey);

            // Return Value If Not Null
            if (cacheValue is not null)
            {
                context.Result = new ContentResult()
                {
                    Content = cacheValue,
                    ContentType = "application/json",
                    StatusCode = StatusCodes.Status200OK
                };
                return;
            }
            // Return Value If Is Null
            // Invoke To Next
            var executedContext = await next.Invoke();
            if (executedContext.Result is OkObjectResult result)
                await cacheService.SetAsync(CacheKey, result.Value!, TimeSpan.FromSeconds(durationInSec));



          

            // Set Value With Cache Key
        }

        private string CreateCacheKey(HttpRequest request)
        {

            // {{BaseUrl}}/api/Product?BrandId=10&TypeId=20
            StringBuilder key = new StringBuilder();
            key.Append(request.Path + '?');

            foreach (var item in request.Query.OrderBy(q => q.Key))
                key.Append($"{item.Key}={item.Value}&");


            return key.ToString();
        }
    }
}
