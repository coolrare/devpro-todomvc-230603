using System;
using System.Collections.Generic;

namespace Backend.Models.Database;

public partial class User
{
    public string Username { get; set; } = null!;

    public string? Password { get; set; }

    public virtual ICollection<TodoItem> TodoItems { get; set; } = new List<TodoItem>();
}
