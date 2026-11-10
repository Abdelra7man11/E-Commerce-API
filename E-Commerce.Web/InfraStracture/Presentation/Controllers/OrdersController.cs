
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.DataTrancfareObject.OrdersDto;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize]
    public class OrdersController(IServiceManager _serviceManager) : ApiBaseController
    {
        //Create Order
        [HttpPost]
        public async Task<ActionResult<OrderToReturnDTo>> CreateAsync(OrderDTo orderDTo)
        {

            var res = await _serviceManager.OrderService.CreateOrderAsync(orderDTo, GetEmailFromToken());
            return Ok(res);
        }

        //Get DeliveryMethod
       [AllowAnonymous]
        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IEnumerable<DeliveryMethodDTo>>> GetDeliveryMethods()
        {
            return Ok(await _serviceManager.OrderService.GetDeliveryMethodsAsync());
        }

        // Get All  Order By Email
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderToReturnDTo>>> GetAllOrders()
        {
            var order = await _serviceManager.OrderService.GetAllOrderAsync(GetEmailFromToken());
            return Ok(order);

        }

        // GEt Order By Id
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<OrderToReturnDTo>> Get(Guid id)
        {
            var order = await _serviceManager.OrderService.GetOrderByIdAsync(id);
            return Ok(order);
        }

    }
}
