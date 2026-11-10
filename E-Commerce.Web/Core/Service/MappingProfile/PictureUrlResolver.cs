using AutoMapper;
using AutoMapper.Execution;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using DomainLayer.Models.ProductsModule;
using Shared.DataTrancfareObject.ProductsModuleDto;

namespace Service.MappingProfile
{
    class PictureUrlResolver(IConfiguration configuration) : IValueResolver<Product, ProductDto, string>
    {
        public string Resolve(Product source, ProductDto destination, string destMember, ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source.PictureUrl))
                return string.Empty;
            else
            {
                //var Url = $"https://localhost:7112/{source.PictureUrl}";

                var Url = $"{configuration.GetSection("Urls")["BaseUrl"]}{source.PictureUrl}";
                return Url;
            }
        }
    }
}
