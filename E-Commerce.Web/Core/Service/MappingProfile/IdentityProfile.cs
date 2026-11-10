using AutoMapper;
using DomainLayer.Models.BasketModule;
using DomainLayer.Models.Identity;
using Shared.DataTrancfareObject.BasketModuleDto;
using Shared.DataTrancfareObject.IdentityDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.MappingProfile
{
    public class IdentityProfile : Profile
    {
        public IdentityProfile()
        {
            CreateMap<Address, AddressDTO>().ReverseMap();
        }
    }
}