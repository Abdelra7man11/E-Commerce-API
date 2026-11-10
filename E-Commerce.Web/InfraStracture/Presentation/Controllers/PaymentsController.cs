using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.DataTrancfareObject.BasketModuleDto;

namespace Presentation.Controllers
{
    public class PaymentsController(IServiceManager _serviceManager) : ApiBaseController
    {
        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<BasketDto?>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _serviceManager.BasketService.GetBasketAsync(basketId);
            if (basket == null) return NotFound();

            if (string.IsNullOrEmpty(basket.paymentIntentId))
            {
                basket.paymentIntentId = "pi_" + Guid.NewGuid().ToString("N");
                basket.clientSecret = basket.paymentIntentId + "_secret_mock";
            }

            var updatedBasket = await _serviceManager.BasketService.CreateOrUpdateBasketAsync(basket);
            return Ok(updatedBasket);
        }
    }
}
