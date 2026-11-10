using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Contracts
{
    public interface ISpecification<TEntity, TKey> where TEntity : BaseEntity<TKey>
    {
        public Expression<Func<TEntity, bool>>? Criteria { get; }
        List<Expression<Func<TEntity, object>>> IncludeExpressions { get; }
        Expression<Func<TEntity, object>> OrderBy { get; } 
        Expression<Func<TEntity, object>> OrderByDesc { get; }

        public int Take { get; }
        public int Skip { get; }
        public bool IsPaginated { get; set; }

    }
}
