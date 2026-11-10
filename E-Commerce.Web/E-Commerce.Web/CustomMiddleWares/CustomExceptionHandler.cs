using DomainLayer.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Shared.ErrorModels;

namespace E_Commerce.Web.CustomMiddleWares
{
    public class CustomExceptionHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomExceptionHandler> _logger;
        public CustomExceptionHandler(RequestDelegate Next, ILogger<CustomExceptionHandler> logger)
        {
            _next = Next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next.Invoke(httpContext);
                await HandleNotFoundEndPointAsync(httpContext);

            }
            catch (Exception ex)
            {

                _logger.LogError("Something Went Error");

                await HandleExceptionErrorAsync(httpContext, ex);

            }
        }

        private static async Task HandleExceptionErrorAsync(HttpContext httpContext, Exception ex)
        {
            //response object
            var Response = new ErrorToReturn()
            {
                ErrorMessage = ex.Message
            };

            // set status code for response
            Response.StatusCode = ex switch
            {
                NotFoundError => StatusCodes.Status404NotFound,
                UnauthorizedException => StatusCodes.Status401Unauthorized,
                BadRequestException badRequestException => GetBadRequestErrors(badRequestException, Response),
                _ => StatusCodes.Status500InternalServerError
            };

            //return object as json 
            httpContext.Response.StatusCode=Response.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(Response);
        }

        private static int GetBadRequestErrors(BadRequestException badRequestException, ErrorToReturn response)
        {
            response.Errors = badRequestException.Errors;
            return StatusCodes.Status400BadRequest;
        }

        private static async Task HandleNotFoundEndPointAsync(HttpContext httpContext)
        {
            if (httpContext.Response.StatusCode == StatusCodes.Status404NotFound)
            {
                var Response = new ErrorToReturn()
                {

                    StatusCode = StatusCodes.Status404NotFound,
                    ErrorMessage = $"End Point {httpContext.Request.Path} Is not Found"
                };

                await httpContext.Response.WriteAsJsonAsync(Response);

            }
        }
    }
}
