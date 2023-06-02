using Backend.Models.Database;
using Backend.Models.Todos;

namespace Backend.Services
{
    public class TodoService
    {
        private readonly TodoListContext todoListContext;
        
        public TodoService(TodoListContext todoListContext)
        {
            this.todoListContext = todoListContext;
        }

        public IEnumerable<TodoItemResponse> GetTodoItems(string username)
        {
            return todoListContext.TodoItems
                .Where(todo => todo.Username == username)
                .Select(todo => new TodoItemResponse
                {
                    Id = todo.Id,
                    Text = todo.Text,
                    Completed = todo.Completed
                });
        }

        public void SetTodoCompleted(string username, int id, bool completed)
        {
            var item = todoListContext.TodoItems.FirstOrDefault(todo => todo.Id == id && todo.Username == username);
            if(item == null)
            {
                return;
            }
            item.Completed = completed;
            todoListContext.SaveChanges();
        }

        public void CreateTodoItem(string username, string text)
        {
            var todo = new TodoItem
            {
                Text = text,
                Completed = false,
                Username = username
            };
            todoListContext.TodoItems.Add(todo);
            todoListContext.SaveChanges();
        }
    }
}
