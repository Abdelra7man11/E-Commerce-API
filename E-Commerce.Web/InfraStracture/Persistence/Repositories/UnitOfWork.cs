using DomainLayer.Contracts;
using DomainLayer.Models;
using Persistence.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class UnitOfWork(StoreDbContext _dbContext) : IUnitOfWork
    {
        // To Cache Repository 
        private readonly Dictionary<string, object> repositories = [];

        public IGenericRepository<TEntity, TKey> GetRepository<TEntity, TKey>() where TEntity : BaseEntity<TKey>
        {
            //Get Type Name
            var typeName = typeof(TEntity).Name;

            if (repositories.TryGetValue(typeName, out object?   value))
                return (IGenericRepository<TEntity, TKey>)value;


            else
            {
                // Create Object
                var Repo = new GenericRepository<TEntity, TKey>(_dbContext);
                // Store Object In Dictionary
                repositories.Add(typeName, Repo);
                // Return Object
                return Repo;
            }
        }

        public async Task<int> SaveChangesAsync() => await _dbContext.SaveChangesAsync();
    }
}

