using Shared.DataTrancfareObject.IdentityDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.OrdersDto
{
    public class OrderDTo
    {
        public string basketId { get; set; } =default!;
        public int deliveryMethodId { get; set; }
        public AddressDTO shipToAddress { get; set; } = default!;


    }
}
