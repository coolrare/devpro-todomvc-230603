using Backend.Models.Auth;
using Backend.Models.Database;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services
{
    public class AuthService
    {
        private readonly IConfiguration configuration;
        private readonly TodoListContext todoListContext;

        public AuthService(IConfiguration configuration, TodoListContext todoListContext)
        {
            this.configuration = configuration;
            this.todoListContext = todoListContext;
        }

        public User? GetUser(string username)
        {
            return todoListContext.Users.FirstOrDefault(data => data.Username == username);
        }

        public void CreateUser(string username, string password)
        {
            var passwordHasher = new PasswordHasher<LoginRequest>();
            var user = new LoginRequest
            {
                Username = username,
                Password = password
            };
            var hashedPassword = passwordHasher.HashPassword(user, password);
            todoListContext.Users.Add(new User
            {
                Username = username,
                Password = hashedPassword
            });
            todoListContext.SaveChanges();
        }

        public bool IsUsernamePasswordExist(string username, string password)
        {
            var user = GetUser(username);
            if (user == null)
            {
                return false;
            }
            var passwordHasher = new PasswordHasher<LoginRequest>();
            var userForValidation = new LoginRequest
            {
                Username = username,
                Password = password
            };
            var result = passwordHasher.VerifyHashedPassword(userForValidation, user.Password, password);
            return result == PasswordVerificationResult.Success;
        }

        public string CreateAccessToken(string username)
        {
            // 只有這裡用到 configuration，中間邏輯都是第三方元件，且較難以測試
            // 可以考慮額外抽成一個 TokenService，讓 AuthService 更好測試
            string key = configuration.GetValue<string>("JwtKey") ?? "";
            var issuer = configuration.GetValue<string>("JwtIssuer") ?? "";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //Create Security Token object by giving required parameters    
            var token = new JwtSecurityToken(
                            issuer,
                            claims: new List<Claim>()
                            {
                                new Claim(JwtRegisteredClaimNames.Sub, username),
                                new Claim(JwtRegisteredClaimNames.Name, username)
                            },
                            expires: DateTime.Now.AddDays(1),
                            signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
