using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Models.Database;
using Microsoft.EntityFrameworkCore;

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
        public void 取得使用者的todo項目()
        {
            // Arrange
            var service = new TodoService(fakeContext);
            var expectedCount = 3;

            // Act
            var actual = service.GetTodoItems("mike");

            // Assert
            Assert.AreEqual(expectedCount, actual.Count());
        }

        [TestMethod]
        public void 將todo項目設定為完成()
        {
            // Arrange
            var service = new TodoService(fakeContext);
            var expected = true;

            // Act
            Assert.AreEqual(
                false,
                fakeContext.TodoItems.FirstOrDefault(x => x.Id == 1)!.Completed
            );
            service.SetTodoCompleted("mike", 1, expected);

            // Assert
            Assert.AreEqual(
                expected,
                fakeContext.TodoItems.FirstOrDefault(x => x.Id == 1)!.Completed
            );
        }

        [TestMethod]
        public void 建立新的todo項目()
        {
            // Arrange
            var service = new TodoService(fakeContext);

            // Act
            Assert.AreEqual(
                3,
                fakeContext.TodoItems.Where(item => item.Username == "mike").Count());
            service.CreateTodoItem("mike", "hello world");

            // Assert
            Assert.AreEqual(
                4,
                fakeContext.TodoItems.Where(item => item.Username == "mike").Count(), 4);
        }
    }
}