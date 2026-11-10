using AutoMapper;
using DomainLayer.Exceptions;
using DomainLayer.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ServiceAbstraction;
using Shared.DataTrancfareObject.IdentityDto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.Eventing.Reader;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class AuthenticationService(UserManager<ApplicationUser> _userManager, IConfiguration _configuration, IMapper _mapper) : IAuthenticationService
    {

        public async Task<bool> CheckEmailAsync(string Email)
        {
            var User = await _userManager.FindByEmailAsync(Email);
            return User is not null;

        }
        public async Task<UserDTO> GetCurrentUserAsync(string Email)
        {
            var User = await _userManager.FindByEmailAsync(Email) ?? throw new UserNotFoundException(Email);
            return new UserDTO()
            {
                displayName = User.DisplayName,
                email = User.Email,
                token = await CreateTokenAsync(User)
            };

        }

        public async Task<AddressDTO?> GetCurrentUserAddressAsync(string Email)
        {
            var User = await _userManager.Users.Include(U => U.Address)
                .FirstOrDefaultAsync(U => U.Email == Email) ?? throw new UserNotFoundException(Email);
            if (User.Address is not null)
                return _mapper.Map<Address, AddressDTO>(User.Address);
            else
                return null;
        }

        public async Task<AddressDTO> UpdateCurrentUserAddressAsync(string Email, AddressDTO addressDTO)
        {
            var User = await _userManager.Users.Include(U => U.Address)
              .FirstOrDefaultAsync(U => U.Email == Email) ?? throw new UserNotFoundException(Email);
            if (User.Address is not null) // Update
            {
                User.Address.FirstName = addressDTO.FirstName;
                User.Address.LastName = addressDTO.LastName;
                User.Address.City = addressDTO.City;
                User.Address.Country = addressDTO.Country;
                User.Address.Street = addressDTO.street;

            }

            else // Add New Address
            {
                User.Address = _mapper.Map<AddressDTO, Address>(addressDTO);

            }

            await _userManager.UpdateAsync(User);

            return _mapper.Map<Address, AddressDTO>(User.Address);

        }

        // Login User
        public async Task<UserDTO> LoginAsync(LoginDTO loginDTO)
        {
            // Check If Email Is Exists
            var User = await _userManager.FindByEmailAsync(email: loginDTO.Email) ?? throw new UserNotFoundException(email: loginDTO.Email);

            // Check Password
            var IsPasswordValid = await _userManager.CheckPasswordAsync(user: User, password: loginDTO.Password);
            if (IsPasswordValid)
                return new UserDTO()
                {
                    displayName = User.DisplayName,
                    email = User.Email,
                    token = await CreateTokenAsync(User)
                };
            else
                throw new UnauthorizedException();
        }

        public async Task<UserDTO> RegisterAsync(RegisterDTO registerDTO)
        {
            // Mapping Register Dto => Application User
            var User = new ApplicationUser()
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                PhoneNumber = registerDTO.PhoneNumber,
                UserName = registerDTO.UserName
            };

            // Create User [Application User]
            var Result = await _userManager.CreateAsync(user: User, password: registerDTO.Password);
            if (Result.Succeeded)
                return new UserDTO()
                {
                    displayName = User.DisplayName,
                    email = User.Email,
                    token = await CreateTokenAsync(User)
                };
            else
            {
                // Throw BadRequest Exceptions
                var Error = Result.Errors.Select(E => E.Description).ToList();
                throw new BadRequestException(Error);
            }
            // Return UserDto
            // Throw BadRequest Exceptions
        }

        private async Task<string> CreateTokenAsync(ApplicationUser user)
        {
            var Claims = new List<Claim>()
            {
                new(ClaimTypes.Email, user.Email!),
                new(ClaimTypes.Name, user.UserName!),
                new(ClaimTypes.NameIdentifier, user.Id!)
            };
            var Role = await _userManager.GetRolesAsync(user);
            foreach (var role in Role)
            {
                Claims.Add(new(ClaimTypes.Role, role));
            }
            var SecretKey = _configuration.GetSection("JWTOptions")["SecretKey"];
            var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
            var Creds = new SigningCredentials(Key, algorithm: SecurityAlgorithms.HmacSha256);

            var Token = new JwtSecurityToken(
                issuer: _configuration["JWTOptions:Issuer"],
                audience: _configuration["JWTOptions:Audience"],
                claims: Claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: Creds);
            return new JwtSecurityTokenHandler().WriteToken(Token);

        }


    }
}
