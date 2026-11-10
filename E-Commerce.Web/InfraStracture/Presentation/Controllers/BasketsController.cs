using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.DataTrancfareObject.BasketModuleDto;

namespace Presentation.Controllers
{
    public class BasketsController(IServiceManager _serviceManager) : ApiBaseController
    {
        // Get Basket
        [HttpGet] // GET BaseUrl/api/Baskets?id=... or ?key=...
        public async Task<ActionResult<BasketDto?>> GetBasket([FromQuery] string? id, [FromQuery] string? key)
        {
            var basketKey = id ?? key;
            if (string.IsNullOrEmpty(basketKey)) return Ok(null);

            var basket = await _serviceManager.BasketService.GetBasketAsync(basketKey);
            return Ok(basket);
        }

        // Create Or Update Basket
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdateBasket(BasketDto basket)
        {
            var Basket = await _serviceManager.BasketService.CreateOrUpdateBasketAsync(basket);
            return Ok(Basket);
        }

        // Delete Basket
        [HttpDelete]
        [HttpDelete("{Key}")]
        public async Task<IActionResult> DeleteBasket([FromQuery] string? id, [FromRoute] string? Key)
        {
            var basketKey = id ?? Key;
            if (string.IsNullOrEmpty(basketKey)) return BadRequest();

            var Result = await _serviceManager.BasketService.DeleteBasketAsync(basketKey);
            return Ok(Result);
        }
    }
}
