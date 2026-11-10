using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTrancfareObject.IdentityDto
{
    public class UserDTO
    {
        public string email { get; set; } = default!;
        public string token { get; set; } = default!;
        public string displayName { get; set; } = default!;
    }
}
