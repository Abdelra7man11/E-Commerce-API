using Shared;
using Shared.DataTrancfareObject.ProductsModuleDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstraction
{
    public interface IProductService
    {
        Task<PaginationResult<ProductDto>> GetAllProductAsync(ProductQueryParams queryParams);
        Task<ProductDto> GetProductByIdAsync(int id);
        Task<IEnumerable<BrandDto>> GetAllBrandAsync();
        Task<IEnumerable<TypeDto>> GetAllTypeAsync();
    }
}
