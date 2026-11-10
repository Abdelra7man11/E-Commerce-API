using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.BasketModuleDto
{
    public class BasketItemDto
    {
        public int id { get; set; }
        public string productName { get; set; } = default!;
        public string pictureUrl { get; set; } = default!;
            
        [Range(1, double.MaxValue)]
        public decimal price { get; set; }

        [Range(1, 100)]
        public int quantity { get; set; }

        public string? brand { get; set; }
        public string? type { get; set; }
    }
}
