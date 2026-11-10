using AutoMapper;
using Domain.Models.Orders;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models.OrderModule;
using DomainLayer.Models.ProductsModule;
using Microsoft.Extensions.Logging;
using ServiceAbstraction;
using Services.Specifications;
using Shared.DataTrancfareObject.IdentityDto;
using Shared.DataTrancfareObject.OrdersDto;
using System;

namespace Services
{
    public class OrderService(IMapper _mapper, IBasketRepository _basketRepository, IUnitOfWork _unitOfWork) : IOrderService
    {
        // Create Order
        public async Task<OrderToReturnDTo> CreateOrderAsync(OrderDTo OrderDTo, string Email)
        {

            // Map Address To Order Address
            var OrderAddress = _mapper.Map<AddressDTO, OrderAddress>(OrderDTo.shipToAddress);
            // Get Basket
            var Basket = await _basketRepository.GetBasketAsync(OrderDTo.basketId)
                        ?? throw new BasketNotFoundException(OrderDTo.basketId);

            // Create OrderItem List
            List<OrderItem> orderItems = [];
            var productRepo = _unitOfWork.GetRepository<Product, int>();
            foreach (var item in Basket.Items)
            {
                var product = await productRepo.GetByIdAsync(item.Id)
                    ?? throw new ProductNotFoundError(item.Id);
                orderItems.Add(CreateOrderItem(item, product));
            }
            // Get Delivery Method
            var Delivery = await _unitOfWork.GetRepository<DeliveryMethod, int>().GetByIdAsync(OrderDTo.deliveryMethodId)
                ?? throw new DeliveryMethodNotFoundException(OrderDTo.deliveryMethodId);
            // Calculate Sub Total
            var SubTotal = orderItems.Sum(I => I.Quantity * I.Price);

            var Order = new Order(Email, OrderAddress, Delivery, orderItems, SubTotal);

            await _unitOfWork.GetRepository<Order, Guid>().AddAsync(Order);

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<Order, OrderToReturnDTo>(Order);

        }

        // Get All DeliveryMethod
        public async Task<IEnumerable<DeliveryMethodDTo>> GetDeliveryMethodsAsync()
        {
            var deliveryMethods = await _unitOfWork.GetRepository<DeliveryMethod, int>().GetAllAsync();
            return _mapper.Map<IEnumerable<DeliveryMethod>, IEnumerable<DeliveryMethodDTo>>(deliveryMethods);

        }

        // Get All Orders
        public async Task<IEnumerable<OrderToReturnDTo>> GetAllOrderAsync(string email)
        {
            var spec = new OrderSpecification(email);
            var orders = await _unitOfWork.GetRepository<Order, Guid>().GetAllAsync(spec);

            return _mapper.Map<IEnumerable<Order>, IEnumerable<OrderToReturnDTo>>(orders);
        }

        // Get Order By Id
        public async Task<OrderToReturnDTo> GetOrderByIdAsync(Guid id)
        {
            var spec = new OrderSpecification(id);
            var order = await _unitOfWork.GetRepository<Order, Guid>().GetByIdAsync(spec);

            return _mapper.Map<OrderToReturnDTo>(order);
        }
        private static OrderItem CreateOrderItem(DomainLayer.Models.BasketModule.BasketItem item, Product product)
        {
            return new OrderItem()
            {
                Product = new ProductItemOrdered() { ProductId = product.Id, PictureUrl = product.PictureUrl, ProductName = product.Name },
                Price = product.Price,
                Quantity = item.Quantity,
            };
        }

    }
}

