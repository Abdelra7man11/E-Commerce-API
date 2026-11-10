using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.DataTrancfareObject.BasketModuleDto;

namespace Presentation.Controllers
{
    public class BasketsController(IServiceManager _serviceManager) : ApiBaseController
    {
        // Get Basket: GET /api/Baskets?id=... or /api/Baskets/{id}
        [HttpGet]
        [HttpGet("{id}")]
        public async Task<ActionResult<BasketDto?>> GetBasket([FromRoute] string? id, [FromQuery] string? key)
        {
            var basketKey = id ?? key;
            if (string.IsNullOrEmpty(basketKey)) return Ok(null);

            var basket = await _serviceManager.BasketService.GetBasketAsync(basketKey);
            return Ok(basket);
        }

        // Create Or Update Basket: POST /api/Baskets
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdateBasket(BasketDto basket)
        {
            var Basket = await _serviceManager.BasketService.CreateOrUpdateBasketAsync(basket);
            return Ok(Basket);
        }

        // Delete Basket: DELETE /api/Baskets/{id} or DELETE /api/Baskets?id=...
        [HttpDelete("{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteBasket([FromRoute] string? id, [FromQuery] string? key)
        {
            var basketKey = id ?? key;
            if (string.IsNullOrEmpty(basketKey)) return Ok(true);

            var result = await _serviceManager.BasketService.DeleteBasketAsync(basketKey);
            return Ok(result);
        }
    }
}
