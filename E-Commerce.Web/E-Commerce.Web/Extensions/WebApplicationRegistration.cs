using DomainLayer.Contracts;
using E_Commerce.Web.CustomMiddleWares;

namespace E_Commerce.Web.Extensions
{
    public static class WebApplicationRegistration
    {
        public static async Task AddDataSeedAsync(this WebApplication app)
        {
            using var Scoop = app.Services.CreateScope();

            var ObjectDataSeeding = Scoop.ServiceProvider.GetRequiredService<IDataSeeding>();

            await ObjectDataSeeding.DataSeedAsync();
            await ObjectDataSeeding.IdentityDataSeedAsync();
        }

        public static IApplicationBuilder UseCustomExceptionMiddleWare(this IApplicationBuilder app)
        {
            // MiddleWare to Exception

            app.UseMiddleware<CustomExceptionHandler>();
            return app;

        }

        public static IApplicationBuilder UseSwagerMiddleWare(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI();

            return app;

        }
    }
}
