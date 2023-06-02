namespace Backend.Models.Todos
{
    public class ChangeTodoCompletedRequest
    {
        public int Id { get; set; }
        public bool Completed { get; set; }
    }
}
