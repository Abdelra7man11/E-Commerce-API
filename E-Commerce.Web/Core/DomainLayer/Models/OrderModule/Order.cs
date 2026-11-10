using DomainLayer.Models;
using DomainLayer.Models.OrderModule;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Orders
{
    public class Order:BaseEntity<Guid>
    {
        public Order()
        {

        }

        public Order(string userEmail, OrderAddress address, DeliveryMethod deliveryMethod, ICollection<OrderItem> items, decimal subTotal)
        {
            buyerEmail = userEmail;
            shipToAddress = address;
            DeliveryMethod = deliveryMethod;
            Items = items;
            SubTotal = subTotal;
        }

        public string buyerEmail { get; set; } = default!;
        public OrderAddress shipToAddress { get; set; } = default!;

        public DeliveryMethod DeliveryMethod { get; set; } = default!; 
        public int DeliveryMethodId { get; set; } // FK 
        
        public ICollection<OrderItem> Items { get; set; } = [];
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public OrderStatus Status { get; set; } 
        
        public decimal SubTotal { get; set; }
        public decimal GetTotal() => SubTotal + DeliveryMethod.Price;

        //[NotMapped]
        //public decimal Total { get => SubTotal + DeliveryMethod.Price; }


    }

}
