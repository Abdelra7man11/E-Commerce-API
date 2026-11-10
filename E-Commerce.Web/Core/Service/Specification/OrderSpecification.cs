using Domain.Models.Orders;
using Service.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications
{
     class OrderSpecification : BaseSpecification<Order , Guid>
    {
        //For GetAll
        public OrderSpecification(string email) : base(o => o.buyerEmail == email)
        {
            AddInclude(o => o.DeliveryMethod);
            AddInclude(o => o.Items);
            AddOrderByDesc(o=>o.OrderDate);
        }
        //For Get By Id
        public OrderSpecification(Guid id):base(o=>o.Id == id)
        {
            AddInclude(o => o.Items);
            AddInclude(o => o.DeliveryMethod);
        }

    }
}
