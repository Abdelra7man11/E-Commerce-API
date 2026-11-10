using ServiceAbstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Service
{
     class CacheService(ICacheRepository _cacheRepo) : ICacheService
    {
        public async Task<string?> GetAsync(string key) => await _cacheRepo.GetAsync(key);      
        
        public async Task SetAsync(string key, object value, TimeSpan timeToLive)
        {
            var Cachevalue = JsonSerializer.Serialize(value);
            await _cacheRepo.SetAsync(key, Cachevalue, timeToLive);
        }
    }
}
