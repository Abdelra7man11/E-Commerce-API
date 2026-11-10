using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models.ProductsModule;
using Service.Specification;
using ServiceAbstraction;
using Shared;
using Shared.DataTrancfareObject.ProductsModuleDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class ProductService(IUnitOfWork _unitOfWork, IMapper _mapper) : IProductService
    {
        public async Task<IEnumerable<BrandDto>> GetAllBrandAsync()
        {
            var Brand = await _unitOfWork.GetRepository<ProductBrand, int>().GetAllAsync();
            var BrandDto = _mapper.Map<IEnumerable<ProductBrand>, IEnumerable<BrandDto>>(Brand);
            return BrandDto;
        }

        public async Task<PaginationResult<ProductDto>> GetAllProductAsync(ProductQueryParams queryParams)
        {
            var Repo = _unitOfWork.GetRepository<Product, int>();
            var specification = new ProductWithBrandSpecification(queryParams);
            var Products = await Repo.GetAllAsync(specification);
            var Data = _mapper.Map<IEnumerable<Product>, IEnumerable<ProductDto>>(Products);
            var ProductCount = Products.Count();
            var CountSpecifc = new ProductCountSpecification(queryParams);
            var TotalCount = await Repo.CountAsync(CountSpecifc);
            return new PaginationResult<ProductDto>(queryParams.PageNumber, ProductCount, TotalCount, Data);
        }

        public async Task<IEnumerable<TypeDto>> GetAllTypeAsync()
        {
            var Types = await _unitOfWork.GetRepository<ProductType, int>().GetAllAsync();
            var TypesDto = _mapper.Map<IEnumerable<ProductType>, IEnumerable<TypeDto>>(Types);
            return TypesDto;
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var specification = new ProductWithBrandSpecification(id);
            var Products = await _unitOfWork.GetRepository<Product, int>().GetByIdAsync(specification: specification);

            if (Products is null)
            {
                throw new ProductNotFoundError(id);
            }

            var ProductsDto = _mapper.Map<Product, ProductDto>(Products);
            return ProductsDto;
        }
    }
}
