using AutoMapper;
using DomainLayer.Models.BasketModule;
using Shared.DataTrancfareObject.BasketModuleDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.MappingProfile
{
    public class BasketProfile : Profile
    {
        public BasketProfile()
        {
            CreateMap<BasketDto, CustomerBasket>().ReverseMap();
            CreateMap<BasketItemDto, BasketItem>().ReverseMap();
        }
    }
}
