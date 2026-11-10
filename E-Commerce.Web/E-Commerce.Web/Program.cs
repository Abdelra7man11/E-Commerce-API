
using AutoMapper;
using DomainLayer.Contracts;
using E_Commerce.Web.CustomMiddleWares;
using E_Commerce.Web.Extensions;
using E_Commerce.Web.Factories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Persistence.Data;
using Persistence.Repositories;
using Service;
using Service.MappingProfile;
using ServiceAbstraction;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Text.Json;
using System.Threading.Tasks;

namespace E_Commerce.Web
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);



            #region  Add services to the container.
            builder.Services.AddControllers().AddJsonOptions(option =>
            {
                option.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            }); // To Request convert to CamelCase

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular", policy =>
                {
                    policy.SetIsOriginAllowed(origin => true)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });



            builder.Services.AddSwagerServices();
            builder.Services.AddInfraStructureServices(builder.Configuration);
            builder.Services.AddApplicationServices();
            builder.Services.AddWebApplicationServices();
            builder.Services.AddJWTServices(builder.Configuration);

            #endregion

            var app = builder.Build();

            await app.AddDataSeedAsync();

            // Configure the HTTP request pipeline.


            app.UseCustomExceptionMiddleWare();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.ConfigObject = new ConfigObject()
                {
                    DisplayRequestDuration = true
                };
                options.DocumentTitle = "NovaMart E-Commerce API";
                options.DocExpansion(DocExpansion.None);
                options.EnableFilter();
                options.EnablePersistAuthorization();
            });

            app.MapGet("/", () => Results.Redirect("/swagger"));

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCors("AllowAngular"); // to config angular
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();



            app.Run();
        }
    }
}
