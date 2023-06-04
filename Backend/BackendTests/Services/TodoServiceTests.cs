using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Models.Database;
using Microsoft.EntityFrameworkCore;
using Backend.Models.Todos;

namespace Backend.Services.Tests
{
    [TestClass()]
    public class TodoServiceTests
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

        [TestMethod()]
        public void GetTodoItems可以取得資料庫中的資料()
        {
            // Arrange
            var service = new TodoService(fakeContext);
            var expected = new List<TodoItemResponse>
            {
                new TodoItemResponse()
                {
                    Id = 1,
                    Text = "Task 1",
                    Completed = false,
                },
                new TodoItemResponse()
                {
                    Id = 2,
                    Text = "Task 2",
                    Completed = true,
                },
                new TodoItemResponse()
                {
                    Id = 3,
                    Text = "Task 3",
                    Completed = false,
                },
            };

            // Act
            var actual = service.GetTodoItems("mike");

            // Assert
            Assert.AreEqual(3, actual.Count());
            Assert.AreEqual("Task 1", actual.First().Text);
        }

        [TestMethod()]
        public void CreateTodoItem可以對資料庫新增一筆資料()
        {
            // Arrange
            var username = "mike";
            var text = "DEMO";
            var service = new TodoService(fakeContext);

            // Act
            service.CreateTodoItem(username, text);

            // Assert
            //Assert.AreEqual(
            //    4,
            //    service.GetTodoItems(username).Count());
            var items = fakeContext.TodoItems.Where(item => item.Username == username);
            Assert.AreEqual(
                4,
                items.Count());
            Assert.AreEqual(
                "DEMO",
                items.OrderByDescending(item => item.Id).First().Text);
        }
    }
}