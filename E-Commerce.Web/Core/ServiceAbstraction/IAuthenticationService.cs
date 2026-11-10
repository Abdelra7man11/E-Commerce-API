using Shared.DataTrancfareObject.IdentityDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstraction
{

    public interface IAuthenticationService
    {
        // Login
        // Take Email and Password Then Return Token, Email and DisplayName
        Task<UserDTO> LoginAsync(LoginDTO loginDTO);

        // Register
        // Take Email, Password, UserName, DisplayName And PhoneNumber
        // Then Return Token, Email and DisplayName
        Task<UserDTO> RegisterAsync(RegisterDTO registerDTO);

        // Check Email
        // Takes string Email and returns bool
        Task<bool> CheckEmailAsync(string Email);

        // Get Current User Address
        // Takes string Email and returns AddressDTO
        Task<AddressDTO?> GetCurrentUserAddressAsync(string Email);

        // Update Current User Address
        // Takes AddressDTO UpdatedAddress and string Email, returns AddressDTO after update
        Task<AddressDTO> UpdateCurrentUserAddressAsync(string Email, AddressDTO addressDTO);

        // Get Current User
        // Takes string Email and returns UserDTO (Token, Email and DisplayName)
        Task<UserDTO> GetCurrentUserAsync(string Email);


    }
}
