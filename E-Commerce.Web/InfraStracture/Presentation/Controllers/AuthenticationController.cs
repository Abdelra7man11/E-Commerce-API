using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.DataTrancfareObject.IdentityDto;
using System.Security.Claims;

namespace Presentation.Controllers
{
    public class AuthenticationController(IServiceManager _serviceManager) : ApiBaseController
    {
        // Login
        [HttpPost("Login")] // POST BaseUrl/api/Authentication/Login
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _serviceManager.AuthenticationService.LoginAsync(loginDTO);
            return Ok(user);
        }

        // Register
        [HttpPost("Register")] // POST BaseUrl/api/Authentication/Register
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            var user = await _serviceManager.AuthenticationService.RegisterAsync(registerDTO);
            return Ok(user);
        }

        // Check Email 
        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmail(string Email)
        {
            var Resut = await _serviceManager.AuthenticationService.CheckEmailAsync(Email);
            return Ok(Resut);
        }

        // Get Current User
        [Authorize]
        [HttpGet]
        [HttpGet("CurrentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var AppUser = await _serviceManager.AuthenticationService.GetCurrentUserAsync(email!);
            return Ok(AppUser);
        }

        // Get Current User Address
        [Authorize]
        [HttpGet("Address")]
        public async Task<ActionResult<AddressDTO?>> GetCurrentUserAddress()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var Address = await _serviceManager.AuthenticationService.GetCurrentUserAddressAsync(email!);
            return Ok(Address);
        }

        // Update Current User Address
        [Authorize]
        [HttpPut("Address")]
        public async Task<ActionResult<AddressDTO>> UpdateCurrentUserAddress(AddressDTO addressDTO)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var UpdatedAddress = await _serviceManager.AuthenticationService.UpdateCurrentUserAddressAsync(email, addressDTO);
            return Ok(UpdatedAddress);

        }
    }
}
