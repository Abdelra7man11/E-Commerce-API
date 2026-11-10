using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.BasketModuleDto
{
    public class BasketDto
    {
        public string id { get; set; } // Guid  Created From FrontEnd
        public ICollection<BasketItemDto> items { get; set; } = [];
        public string? clientSecret { get; set; }
        public string? paymentIntentId { get; set; }
        public decimal? deliveryMethodId { get; set; }
        public decimal? shippingPrice { get; set; }
    }
}
