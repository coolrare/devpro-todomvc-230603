using Backend.Models.Database;

namespace Backend.Services
{
    public interface IAuthService
    {
        string CreateAccessToken(string username);
        void CreateUser(string username, string password);
        User? GetUser(string username);
        bool IsUsernamePasswordExist(string username, string password);
    }
}