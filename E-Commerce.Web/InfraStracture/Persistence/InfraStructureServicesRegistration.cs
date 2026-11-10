using DomainLayer.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Persistence.Identity;
using StackExchange.Redis;

namespace Persistence
{
    public static class InfraStructureServicesRegistration
    {
        public static IServiceCollection AddInfraStructureServices(this IServiceCollection Services, IConfiguration Configuration)
        {


            // DataBase 
            var defaultConn = Configuration.GetConnectionString("DefultConnection") ?? "";
            Services.AddDbContext<StoreDbContext>(options =>
            {
                if (IsPostgres(defaultConn))
                    options.UseNpgsql(ConvertToNpgsqlConn(defaultConn));
                else
                    options.UseSqlServer(defaultConn);
            });

            // Services REgistration
            Services.AddScoped<IDataSeeding, DataSeeding>();
            Services.AddScoped<IUnitOfWork, UnitOfWork>();
            Services.AddScoped<IBasketRepository, BasketRepository>();
            Services.AddScoped<ICacheRepository, CacheRepository>();

            //Redis Memory
            Services.AddSingleton<IConnectionMultiplexer>((_) =>
            {
                var redisConn = Configuration.GetConnectionString("RedisConnectionString") ?? "localhost:6379";
                if (redisConn.StartsWith("redis://", StringComparison.OrdinalIgnoreCase))
                {
                    var uri = new Uri(redisConn);
                    var userInfo = uri.UserInfo.Split(':');
                    var password = userInfo.Length > 1 ? userInfo[1] : "";
                    var opt = new ConfigurationOptions
                    {
                        EndPoints = { $"{uri.Host}:{(uri.Port > 0 ? uri.Port : 6379)}" },
                        Password = password,
                        Ssl = true,
                        AbortOnConnectFail = false
                    };
                    return ConnectionMultiplexer.Connect(opt);
                }
                return ConnectionMultiplexer.Connect(redisConn);
            });

            // DataBase Of Identity Users
            var identityConn = Configuration.GetConnectionString("IdentityConnection") ?? defaultConn;
            Services.AddDbContext<StoreIdentityDbContext>(options =>
            {
                if (IsPostgres(identityConn))
                    options.UseNpgsql(ConvertToNpgsqlConn(identityConn));
                else
                    options.UseSqlServer(identityConn);
            });

            Services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;
            })
                    .AddRoles<IdentityRole>()
                    .AddEntityFrameworkStores<StoreIdentityDbContext>();


            return Services;
        }

        private static bool IsPostgres(string conn)
        {
            if (string.IsNullOrWhiteSpace(conn)) return false;
            return conn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
                   conn.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) ||
                   conn.Contains("Host=", StringComparison.OrdinalIgnoreCase) ||
                   conn.Contains("Port=5432", StringComparison.OrdinalIgnoreCase);
        }

        private static string ConvertToNpgsqlConn(string conn)
        {
            if (conn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
                conn.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
            {
                var uri = new Uri(conn);
                var userInfo = uri.UserInfo.Split(':');
                var username = userInfo[0];
                var password = userInfo.Length > 1 ? userInfo[1] : "";
                var database = uri.AbsolutePath.TrimStart('/');
                if (string.IsNullOrEmpty(database)) database = "neondb";
                return $"Host={uri.Host};Port={(uri.Port > 0 ? uri.Port : 5432)};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
            }
            return conn;
        }
    }
}
