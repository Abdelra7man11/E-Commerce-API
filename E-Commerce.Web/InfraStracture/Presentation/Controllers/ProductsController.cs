using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Attributes;
using ServiceAbstraction;
using Shared;
using Shared.DataTrancfareObject.ProductsModuleDto;

namespace Presentation.Controllers
{
    public class ProductsController(IServiceManager _serviceManager) : ApiBaseController
    {
        [HttpGet]
        public async Task<ActionResult<PaginationResult<ProductDto>>> GetAllProduct([FromQuery] ProductQueryParams queryParams)
        {
            var products = await _serviceManager.ProductService.GetAllProductAsync(queryParams);
            return Ok(products);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var products = await _serviceManager.ProductService.GetProductByIdAsync(id);
            return Ok(products);
        }
        [HttpGet("types")]
        [RedisCache]
        public async Task<ActionResult<IEnumerable<TypeDto>>> GetAllType()
        {
            var TypeProduct = await _serviceManager.ProductService.GetAllTypeAsync();
            return Ok(TypeProduct);
        }
        [HttpGet("brands")]
        [RedisCache]
        public async Task<ActionResult<IEnumerable<BrandDto>>> GetAllBrand()
        {
            var Brandproducts = await _serviceManager.ProductService.GetAllBrandAsync();
            return Ok(Brandproducts);
        }

    }
}
