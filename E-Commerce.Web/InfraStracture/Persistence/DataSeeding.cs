using Domain.Models.Orders;
using DomainLayer.Contracts;
using DomainLayer.Models.Identity;
using DomainLayer.Models.ProductsModule;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;
using Persistence.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Persistence
{
    public class DataSeeding(
        StoreDbContext _dbContext,
        UserManager<ApplicationUser> _userManager,
        RoleManager<IdentityRole> _roleManager,
        StoreIdentityDbContext _identityDbContext ) : IDataSeeding
    {
        public async Task DataSeedAsync()
        {
            try
            {
                var PendingMigrate = await _dbContext.Database.GetPendingMigrationsAsync();

                // Production 
                if (PendingMigrate.Any())
                {
                    await _dbContext.Database.MigrateAsync();
                }
                if (!_dbContext.Set<ProductBrand>().Any())
                {
                 using var ProductBrandData = File.OpenRead(@"..\InfraStracture\Persistence\Data\DataSeed\brands.json");
                    // Convert From JSON FIle TO List
                    var ProductBrand = await JsonSerializer.DeserializeAsync<List<ProductBrand>>(ProductBrandData);
                    if (ProductBrand != null && ProductBrand.Any())
                        await _dbContext.ProductBrands.AddRangeAsync(ProductBrand);

                }
                if (!_dbContext.Set<ProductType>().Any())
                {
                    using var ProductTypesData = File.OpenRead(@"..\InfraStracture\Persistence\Data\DataSeed\types.json");
                    // Convert From JSON FIle TO List
                    var ProductTypes = await JsonSerializer.DeserializeAsync<List<ProductType>>(ProductTypesData);
                    if (ProductTypes != null && ProductTypes.Any())
                        await _dbContext.ProductTypes.AddRangeAsync(ProductTypes);

                }
                if (!_dbContext.Set<Product>().Any())
                {
                    using var ProductsData = File.OpenRead(@"..\InfraStracture\Persistence\Data\DataSeed\products.json");
                    // Convert From JSON FIle TO List
                    var Products = await JsonSerializer.DeserializeAsync<List<Product>>(ProductsData);
                    if (Products != null && Products.Any())
                        await _dbContext.Products.AddRangeAsync(Products);

                }
                if (!_dbContext.Set<DeliveryMethod>().Any())
                {
                    using var DeliveryMethodData = File.OpenRead(@"..\InfraStracture\Persistence\Data\DataSeed\delivery.json");
                    // Convert From JSON FIle TO List
                    var DeliveryMethod = await JsonSerializer.DeserializeAsync<List<DeliveryMethod>>(DeliveryMethodData);
                    if (DeliveryMethod != null && DeliveryMethod.Any())
                        await _dbContext.Set<DeliveryMethod>().AddRangeAsync(DeliveryMethod);

                }

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
               // Go TO Error Page

            }
        }

        public async Task IdentityDataSeedAsync()
        {
            try
            {
                var pendingMigrations = await _identityDbContext.Database.GetPendingMigrationsAsync();
                if (pendingMigrations.Any())
                {
                    await _identityDbContext.Database.MigrateAsync();
                }

                if (!_roleManager.Roles.Any())
                {
                    await _roleManager.CreateAsync(new IdentityRole("Admin"));
                    await _roleManager.CreateAsync(new IdentityRole("SuperAdmin"));
                }

                if (!_userManager.Users.Any())
                {
                    var User01 = new ApplicationUser()
                    {
                        Email = "Mohamed1@gmail.com",
                        DisplayName = "Moahmed Ahmed",
                        PhoneNumber = "1234567890",
                        UserName = "MohamedAhmad"
                    };
                    var User02 = new ApplicationUser()
                    {
                        Email = "Salma@gmail.com",
                        DisplayName = "Salma Moahmed",
                        PhoneNumber = "1234567890",
                        UserName = "SalmaMohamed"
                    };

                    await _userManager.CreateAsync(User01, "P@ssw0rd");
                    await _userManager.CreateAsync(User02, "P@ssw0rd");

                    await _userManager.AddToRoleAsync(User01, "Admin");
                    await _userManager.AddToRoleAsync(User02, "SuperAdmin");

                    await _identityDbContext.SaveChangesAsync();
                }


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}