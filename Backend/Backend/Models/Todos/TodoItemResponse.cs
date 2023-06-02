namespace Backend.Models.Todos
{
    public class TodoItemResponse
    {
        public int Id { get; set; }
        public string Text { get; set; } = "";
        public bool Completed { get; set; }
    }
}
