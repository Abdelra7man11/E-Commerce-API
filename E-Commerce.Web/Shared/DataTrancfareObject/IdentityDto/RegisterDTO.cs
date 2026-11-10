using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.IdentityDto
{
    public class RegisterDTO
    {
        [EmailAddress]
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public string? UserName { get; set; } = "Ali";
        public string DisplayName { get; set; } = default!;
        [Phone]
        public string? PhoneNumber { get; set; } 
    }
}
