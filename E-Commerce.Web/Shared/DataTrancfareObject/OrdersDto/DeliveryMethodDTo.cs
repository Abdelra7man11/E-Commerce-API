using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.OrdersDto
{
    public class DeliveryMethodDTo
    {
        public int id { get; set; }
        public string shortName { get; set; } = default!;
        public string description { get; set; } = default!;
        public string deliveryTime { get; set; } = default!;
        public decimal price { get; set; }
        public decimal cost { get => price; set => price = value; }
    }
}
