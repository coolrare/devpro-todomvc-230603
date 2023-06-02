using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Models.Database;
using Microsoft.EntityFrameworkCore;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Backend.Models.Todos;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Backend.Controllers.Tests
{
    [TestClass()]
    public class TodoControllerTests
    {
        private TodoListContext fakeContext;

        [TestInitialize]
        public void TestInitialize()
        {
            // 建立 DbContext
            var options = new DbContextOptionsBuilder<TodoListContext>()
              .UseInMemoryDatabase(databaseName: "TodoList")
              .Options;
            fakeContext = new TodoListContext(options);

            fakeContext.TodoItems.AddRange(new List<TodoItem>
            {
                new TodoItem()
                {
                    Id = 1,
                    Text = "Task 1",
                    Completed = false,
                    Username = "mike"
                },
                new TodoItem()
                {
                    Id = 2,
                    Text = "Task 2",
                    Completed = true,
                    Username = "mike"
                },
                new TodoItem()
                {
                    Id = 3,
                    Text = "Task 3",
                    Completed = false,
                    Username = "mike"
                },
                new TodoItem()
                {
                    Id = 4,
                    Text = "Task 4",
                    Completed = false,
                    Username = "will"
                },
            });
            fakeContext.SaveChanges();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            fakeContext.Database.EnsureDeleted();
            fakeContext.Dispose();
        }

        private TodoController CreateSIT(string username)
        {
            var todoService = new TodoService(fakeContext);
            var controller = new TodoController(todoService);
            // 模擬 user
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, username),
            }));
            controller.ControllerContext.HttpContext = new DefaultHttpContext() { User = user };
            return controller;
        }

        [TestMethod()]
        public void 取得所有todo清單()
        {
            // Arrange
            var controller = CreateSIT("mike");

            // Act
            var actual = controller.Get();

            // Assert
            var result = actual as OkObjectResult;
            Assert.IsNotNull(result);

            var response = result.Value as IEnumerable<TodoItemResponse>;
            Assert.IsNotNull(response);
            Assert.AreEqual(3, response.Count());
        }

        [TestMethod()]
        public void 新增一筆todo項目()
        {
            // Arrange
            var username = "mike";
            var controller = CreateSIT("mike");

            // Act
            var actual = controller.Post(new CreateTodoRequest
            {
                Text = "hello world"
            });

            // Assert
            var result = actual as CreatedResult;
            Assert.IsNotNull(result);

            var todos = fakeContext.TodoItems.Where(x => x.Username == username);
            Assert.AreEqual(4, todos.Count());
            Assert.AreEqual("hello world", todos.OrderByDescending(x => x.Id).First().Text);
        }

        [TestMethod()]
        public void 標記todo項目為完成()
        {
            // Arrange
            var username = "mike";
            var id = 1;
            var controller = CreateSIT("mike");

            // Act
            var before = fakeContext.TodoItems.FirstOrDefault(x => x.Username == username && x.Id == id);
            Assert.IsNotNull(before);
            Assert.IsFalse(before.Completed);

            var actual = controller.Put(new ChangeTodoCompletedRequest
            {
                Id = id,
                Completed = true
            });

            // Assert
            var result = actual as OkResult;
            Assert.IsNotNull(result);

            var after = fakeContext.TodoItems.FirstOrDefault(x => x.Username == username && x.Id == id);
            Assert.IsNotNull(after);
            Assert.IsTrue(after.Completed);
        }

        [TestMethod()]
        public void 標記todo項目為未完成()
        {
            // Arrange
            var username = "mike";
            var id = 2;
            var controller = CreateSIT(username);

            // Act
            var before = fakeContext.TodoItems.FirstOrDefault(x => x.Username == username && x.Id == id);
            Assert.IsNotNull(before);
            Assert.IsTrue(before.Completed);

            var actual = controller.Put(new ChangeTodoCompletedRequest
            {
                Id = id,
                Completed = false
            });

            // Assert
            var result = actual as OkResult;
            Assert.IsNotNull(result);

            var after = fakeContext.TodoItems.FirstOrDefault(x => x.Username == username && x.Id == id);
            Assert.IsNotNull(after);
            Assert.IsFalse(after.Completed);
        }
    }
}