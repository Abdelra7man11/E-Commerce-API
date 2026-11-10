using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public abstract class NotFoundError(string message):Exception($"Not Found {message}")
    {
    }
}
