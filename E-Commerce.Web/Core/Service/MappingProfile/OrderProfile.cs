using AutoMapper;
using Domain.Models.Orders;
using DomainLayer.Contracts;
using Microsoft.Extensions.Configuration;
using Shared.DataTrancfareObject.IdentityDto;
using Shared.DataTrancfareObject.OrdersDto;

namespace Services.MappingProfiles
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<AddressDTO, OrderAddress>().ReverseMap();

            CreateMap<Order, OrderToReturnDTo>()
                .ForMember(dest => dest.deliveryMethod, opt => opt.MapFrom(src => src.DeliveryMethod.ShortName))
                .ForMember(dest => dest.deliveryCost, opt => opt.MapFrom(src => src.DeliveryMethod.Price))
                .ForMember(dest => dest.total, opt => opt.MapFrom(src => src.GetTotal()));

            CreateMap<OrderItem, OrderItemDTo>()
                .ForMember(dest => dest.productId, opt => opt.MapFrom(s => s.Product.ProductId.ToString()))
                .ForMember(dest => dest.productName, opt => opt.MapFrom(s => s.Product.ProductName))
                .ForMember(dest => dest.pictureUrl, opt => opt.MapFrom<OrderItemPictureUrlResolver>());

            CreateMap<DeliveryMethod, DeliveryMethodDTo>();
        }
    }

    public class OrderItemPictureUrlResolver(IConfiguration _configuration) : IValueResolver<OrderItem, OrderItemDTo, string>
    {
        public string Resolve(OrderItem source, OrderItemDTo destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrWhiteSpace(source.Product.PictureUrl))
            {
                var baseUrl = _configuration.GetSection("Urls")["BaseUrl"] ?? _configuration["BaseUrl"] ?? "https://localhost:7112/";
                return $"{baseUrl}{source.Product.PictureUrl}";
            }
            return string.Empty;
        }
    }
}
