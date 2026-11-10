

namespace Persistence.Repositories
{
    public class CacheRepository(IConnectionMultiplexer connection) : ICacheRepository
    {
        readonly IDatabase _database = connection.GetDatabase();
        public async Task<string?> GetAsync(string key)
        {
            var CacheValue = await _database.StringGetAsync(key);
            return CacheValue.IsNullOrEmpty ? null : CacheValue.ToString();
        }

        public async Task SetAsync(string key, string value, TimeSpan TimeToLive)
        {
            await _database.StringSetAsync(key, value, TimeToLive);

        }
    }
}
