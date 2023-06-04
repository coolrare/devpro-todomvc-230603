using Backend.Models;
using Backend.Models.Auth;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AuthService authService;

        public LoginController(AuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost]
        public IActionResult Login(LoginRequest user)
        {
            if (authService.IsUsernamePasswordExist(user.Username, user.Password))
            {
                return Ok(new LoginResponse { AccessToken = authService.CreateAccessToken(user.Username) });
            }
            return Unauthorized();
        }
    }
}
