using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.OrdersDto
{
    public class OrderItemDTo
    {
        public string productId { get; set; } = default!;
        public string productName { get; set; } = default!;
        public string pictureUrl { get; set; } = default!;
        public decimal price { get; set; }
        public int quantity { get; set; }
    }
}