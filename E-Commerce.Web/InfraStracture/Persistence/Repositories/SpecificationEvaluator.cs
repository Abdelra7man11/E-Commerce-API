using DomainLayer.Contracts;
using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    static class SpecificationEvaluator
    {
        public static IQueryable<TEntity> CreateQuery<TEntity, TKey>(IQueryable<TEntity> InputQuery, ISpecification<TEntity, TKey> specification) where TEntity : BaseEntity<TKey>
        {
            var Query = InputQuery;

            if (specification.Criteria is not null)
            {
                Query = Query.Where(specification.Criteria);
            }

            if (specification.OrderBy is not null)
            {
                Query = Query.OrderBy(specification.OrderBy);
            }

            if (specification.OrderByDesc is not null)
            {
                Query = Query.OrderByDescending(specification.OrderByDesc);
            }

            if (specification.IncludeExpressions is not null && specification.IncludeExpressions.Count > 0)
            {
                Query = specification.IncludeExpressions.Aggregate(Query, (CurrentQuery, IncludeExp)
                    => CurrentQuery.Include(IncludeExp));
            }

            if (specification.IsPaginated)
            {
                Query = Query.Skip(specification.Skip).Take(specification.Take);
            }

            return Query;
        }
    }
}
