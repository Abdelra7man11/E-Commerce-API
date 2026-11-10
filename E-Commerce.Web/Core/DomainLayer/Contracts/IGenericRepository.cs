using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
    
namespace DomainLayer.Contracts
{
    public  interface IGenericRepository <TEntity ,TKey> where TEntity : BaseEntity<TKey>
    {
        Task<IEnumerable<TEntity>> GetAllAsync(); // Get all entities
        Task<TEntity> GetByIdAsync (TKey id);  // Get entity by id
        Task AddAsync(TEntity entity);  // Add new entity
        void Update(TEntity entity); // Update existing entity
        void Remove(TEntity entity);  // Delete entity


        Task<IEnumerable<TEntity>> GetAllAsync(ISpecification<TEntity, TKey> specification);
        Task<TEntity?> GetByIdAsync(ISpecification<TEntity, TKey> specification);
        Task<int> CountAsync(ISpecification<TEntity,TKey> specification);
    }
}
