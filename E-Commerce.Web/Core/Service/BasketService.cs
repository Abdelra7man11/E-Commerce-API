using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models.BasketModule;
using ServiceAbstraction;
using Shared.DataTrancfareObject.BasketModuleDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class BasketService(IBasketRepository _basketRepository , IMapper _mapper) : IBasketService
    {
        public async Task<BasketDto> CreateOrUpdateBasketAsync(BasketDto basket)
        {
            var CustomerBasket = _mapper.Map<BasketDto,CustomerBasket>(basket);
            var IsCreated = await _basketRepository.CreateOrUpdateBasketAsync(CustomerBasket);
            if (IsCreated is not null)
                return await GetBasketAsync(basket.id);
            else
                throw new Exception("Can Not Update Or Create Basket Now , Try Again Later");
        }

        public async Task<BasketDto?> GetBasketAsync(string Key)
        {
            var Basket = await _basketRepository.GetBasketAsync(Key);
            if (Basket is not null)
                return _mapper.Map<CustomerBasket,BasketDto>(Basket);
            else
                return null;
        }

        public Task<bool> DeleteBasketAsync(string Key) => _basketRepository.DeleteBasketAsync(Key);

    }
}
