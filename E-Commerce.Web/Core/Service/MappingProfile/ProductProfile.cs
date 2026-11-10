using AutoMapper;
using DomainLayer.Models.ProductsModule;
using Shared.DataTrancfareObject.ProductsModuleDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.MappingProfile
{

    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.name, opt => opt.MapFrom(src => src.Name))                       
                .ForMember(dest => dest.productBrand, opt => opt.MapFrom(src => src.ProductBrand.Name))   
                .ForMember(dest => dest.productType, opt => opt.MapFrom(src => src.ProductType.Name))     
                .ForMember(dest => dest.pictureUrl, opt => opt.MapFrom<PictureUrlResolver>());           

            CreateMap<ProductBrand, BrandDto>();
            CreateMap<ProductType, TypeDto>();
        }


    }
}
