using DomainLayer.Contracts;
using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Service.Specification
{
    abstract class BaseSpecification<TEntity, TKey> : ISpecification<TEntity, TKey> where TEntity : BaseEntity<TKey>
    {

        public Expression<Func<TEntity, bool>>? Criteria { get; private set; }
        protected BaseSpecification(Expression<Func<TEntity, bool>>? CriteriaExpression)
        {
            Criteria = CriteriaExpression;
        }

        #region  Including
        public List<Expression<Func<TEntity, object>>> IncludeExpressions { get; } = [];    
        protected void AddInclude(Expression<Func<TEntity, object>> includeExpression)
        => IncludeExpressions.Add(includeExpression);

        #endregion

        #region Order By


        public Expression<Func<TEntity, object>> OrderBy { get; private set; }

        public Expression<Func<TEntity, object>> OrderByDesc { get; private set; }
        
        protected void AddOrderBy(Expression<Func<TEntity, object>> orderByExp)
            => OrderBy = orderByExp;
        protected void AddOrderByDesc(Expression<Func<TEntity, object>> orderByDescExp)

            => OrderByDesc = orderByDescExp;
        #endregion

        #region Pagination

        public int Take { get; private set; }
        public int Skip { get; private set; }
        public bool IsPaginated { get; set; }

        protected void ApplyPagination(int PageSize , int PageNumber)
        {
            IsPaginated = true;
            Take = PageSize;
            Skip = (PageNumber-1) * PageSize;

        }

        #endregion

    }
}
