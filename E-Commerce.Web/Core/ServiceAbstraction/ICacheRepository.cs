using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstraction
{
    public interface ICacheRepository
    {
        // Get
        Task<string?> GetAsync(string key);
        
        //Set
        Task SetAsync(string key, string value, TimeSpan TimeToLive);
    }
}
