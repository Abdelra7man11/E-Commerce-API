using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.ProductsModuleDto
{
    public class ProductDto
    {

        public int id { get; set; }
        public string name { get; set; } = default!;
        public string description { get; set; } = default!;
        public string pictureUrl { get; set; } = default!;
        public decimal price { get; set; }
        public string productBrand { get; set; } = default!;
        public string productType { get; set; } = default!;

    }
}
