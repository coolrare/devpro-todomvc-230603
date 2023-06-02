using Backend.Models.Todos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly TodoService todoService;

        public TodoController(TodoService todoService)
        {
            this.todoService = todoService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(todoService.GetTodoItems(User.Identity.Name));
        }

        [HttpPost]
        public IActionResult Post(CreateTodoRequest request)
        {
            todoService.CreateTodoItem(User.Identity.Name, request.Text);
            return Created("", null);
        }

        [HttpPut]
        public IActionResult Put(ChangeTodoCompletedRequest request)
        {
            todoService.SetTodoCompleted(User.Identity.Name, request.Id, request.Completed);
            return Ok();
        }
    }
}
