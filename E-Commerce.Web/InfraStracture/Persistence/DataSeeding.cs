using Domain.Models.Orders;
using DomainLayer.Contracts;
using DomainLayer.Models.Identity;
using DomainLayer.Models.ProductsModule;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
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
                if (_dbContext.Database.IsNpgsql())
                {
                    await _dbContext.Database.EnsureCreatedAsync();
                }
                else
                {
                    var PendingMigrate = await _dbContext.Database.GetPendingMigrationsAsync();
                    if (PendingMigrate.Any())
                    {
                        await _dbContext.Database.MigrateAsync();
                    }
                }

                if (!_dbContext.Set<ProductBrand>().Any())
                {
                    using var ProductBrandData = GetSeedStream("brands.json");
                    if (ProductBrandData != null)
                    {
                        var ProductBrand = await JsonSerializer.DeserializeAsync<List<ProductBrand>>(ProductBrandData);
                        if (ProductBrand != null && ProductBrand.Any())
                            await _dbContext.ProductBrands.AddRangeAsync(ProductBrand);
                    }
                }
                if (!_dbContext.Set<ProductType>().Any())
                {
                    using var ProductTypesData = GetSeedStream("types.json");
                    if (ProductTypesData != null)
                    {
                        var ProductTypes = await JsonSerializer.DeserializeAsync<List<ProductType>>(ProductTypesData);
                        if (ProductTypes != null && ProductTypes.Any())
                            await _dbContext.ProductTypes.AddRangeAsync(ProductTypes);
                    }
                }
                if (!_dbContext.Set<Product>().Any())
                {
                    using var ProductsData = GetSeedStream("products.json");
                    if (ProductsData != null)
                    {
                        var Products = await JsonSerializer.DeserializeAsync<List<Product>>(ProductsData);
                        if (Products != null && Products.Any())
                            await _dbContext.Products.AddRangeAsync(Products);
                    }
                }
                if (!_dbContext.Set<DeliveryMethod>().Any())
                {
                    using var DeliveryMethodData = GetSeedStream("delivery.json");
                    if (DeliveryMethodData != null)
                    {
                        var DeliveryMethod = await JsonSerializer.DeserializeAsync<List<DeliveryMethod>>(DeliveryMethodData);
                        if (DeliveryMethod != null && DeliveryMethod.Any())
                            await _dbContext.Set<DeliveryMethod>().AddRangeAsync(DeliveryMethod);
                    }
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
                if (_identityDbContext.Database.IsNpgsql())
                {
                    try
                    {
                        var creator = (RelationalDatabaseCreator)_identityDbContext.Database.GetService<IDatabaseCreator>();
                        await creator.CreateTablesAsync();
                    }
                    catch
                    {
                        // Tables already exist or created
                    }
                }
                else
                {
                    var pendingMigrations = await _identityDbContext.Database.GetPendingMigrationsAsync();
                    if (pendingMigrations.Any())
                    {
                        await _identityDbContext.Database.MigrateAsync();
                    }
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

        private static Stream? GetSeedStream(string fileName)
        {
            var candidates = new[]
            {
                Path.Combine(AppContext.BaseDirectory, "Data", "DataSeed", fileName),
                Path.Combine(AppContext.BaseDirectory, "DataSeed", fileName),
                Path.Combine("..", "InfraStracture", "Persistence", "Data", "DataSeed", fileName),
                Path.Combine("Data", "DataSeed", fileName),
                Path.Combine("Persistence", "Data", "DataSeed", fileName),
                Path.Combine("InfraStracture", "Persistence", "Data", "DataSeed", fileName)
            };
            foreach (var path in candidates)
            {
                if (File.Exists(path))
                    return File.OpenRead(path);
            }
            return null;
        }
    }
}