using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared
{
    public class PaginationResult<TEntity>
    {
        public PaginationResult(int pageNumber, int pageSize, int totalCount, IEnumerable<TEntity> data)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            Count = totalCount;
            Data = data;
        }

        public int PageNumber { get; set; }
        public int PageIndex { get => PageNumber; set => PageNumber = value; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public int TotalCount { get => Count; set => Count = value; }
        public IEnumerable<TEntity> Data { get; set; }
    }
}
