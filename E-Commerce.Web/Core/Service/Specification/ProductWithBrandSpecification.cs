using DomainLayer.Models.ProductsModule;
using Shared;

namespace Service.Specification
{
    class ProductWithBrandSpecification : BaseSpecification<Product, int>
    {
        // GetAll Product With Brand And Type
        public ProductWithBrandSpecification(ProductQueryParams queryParams) : base(
            P =>
            (!queryParams.BrandId.HasValue || P.BrandId == queryParams.BrandId)
            && (!queryParams.TypeId.HasValue || P.TypeId == queryParams.TypeId)
            && (string.IsNullOrEmpty(queryParams.Search) || P.Name.ToLower().Contains(queryParams.Search.ToLower()))
            )
        {
            AddInclude(P => P.ProductBrand);
            AddInclude(P => P.ProductType);

            switch (queryParams.Sort?.ToLower())
            {
                case "priceasc":
                    AddOrderBy(P => P.Price);
                    break;
                case "pricedesc":
                    AddOrderByDesc(P => P.Price);
                    break;
                case "namedesc":
                    AddOrderByDesc(P => P.Name);
                    break;
                case "name":
                case "nameasc":
                default:
                    AddOrderBy(P => P.Name);
                    break;
            }

            ApplyPagination(queryParams.PageSize, queryParams.PageNumber);
        }

        // Get Product Id
        public ProductWithBrandSpecification(int id) : base(p => p.Id == id)
        {
            AddInclude(P => P.ProductBrand);
            AddInclude(P => P.ProductType);
        }
    }
}
