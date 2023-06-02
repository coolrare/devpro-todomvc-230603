using System;
using System.Collections.Generic;

namespace Backend.Models.Database;

public partial class TodoItem
{
    public int Id { get; set; }

    public string Text { get; set; } = null!;

    public bool Completed { get; set; }

    public string Username { get; set; } = null!;

    public virtual User UsernameNavigation { get; set; } = null!;
}
