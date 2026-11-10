using Shared.DataTrancfareObject.IdentityDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.OrdersDto
{
    public class OrderToReturnDTo
    {
        public Guid id { get; set; }
        public string buyerEmail { get; set; } = default!;
        public DateTimeOffset orderDate { get; set; } //HERE
        public ICollection<OrderItemDTo> items { get; set; } = [];//Nav Prop
        public AddressDTO shipToAddress { get; set; } =default!;
        public string deliveryMethod { get; set; } = default!;
        public decimal deliveryCost { get; set; } = default!;
        public string status { get; set; } = default!; //HERE
        public decimal subtotal { get; set; } = default!;
        public decimal total { get; set; } = default!;



    }

}
