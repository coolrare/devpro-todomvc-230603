using Backend.Models.Auth;
using Backend.Models.Database;
using Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace Backend.Controllers
{
#if DEBUG
    [Route("api/[controller]")]
    [ApiController]
    public class ForTestingController : ControllerBase
    {
        private readonly TodoListContext todoListContext;

        public ForTestingController(TodoListContext todoListContext)
        {
            this.todoListContext = todoListContext;
        }

        [HttpPost]
        [Route("create-user")]
        public IActionResult CreateUser(string username, string password)
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
            return Ok();
        }

        [HttpDelete]
        [Route("clear-todos")]
        public IActionResult ClearTodos(string username)
        {
            var todoItems = todoListContext.TodoItems.Where(item => item.Username == username);
            todoListContext.TodoItems.RemoveRange(todoItems);
            todoListContext.SaveChanges();
            return Ok();
        }
    }
#endif
}
