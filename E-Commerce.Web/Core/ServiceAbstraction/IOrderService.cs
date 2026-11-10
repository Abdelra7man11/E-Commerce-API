using Shared.DataTrancfareObject.OrdersDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstraction
{
    public interface IOrderService
    {
        // Create Order
        // Creating Order Will Take Basket Id, Shipping Address, Delivery Method H, Customer
        // And Return Order Details
        // (Id, UserEmail, OrderDate, Items (Product Name - Picture url - Price - Quantity))
        //, Address, Delivery Method Name, Order Status Value, Sub Total, Total Price )

        Task<OrderToReturnDTo> CreateOrderAsync(OrderDTo OrderDTo, string Email);

        Task<IEnumerable<DeliveryMethodDTo>> GetDeliveryMethodsAsync();

        Task<IEnumerable<OrderToReturnDTo>> GetAllOrderAsync(string email);

        Task<OrderToReturnDTo> GetOrderByIdAsync(Guid id);

      
         
       
        



    }
}
