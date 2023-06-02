using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Models.Database;
using Backend.Models.Todos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace Backend.Services.Tests
{
    [TestClass()]
    public class AuthServiceTests
    {
        private TodoListContext fakeContext;
        private IConfiguration fakeConfiguration;

        [TestInitialize]
        public void TestInitialize()
        {
            // 建立 DbContext
            var options = new DbContextOptionsBuilder<TodoListContext>()
              .UseInMemoryDatabase(databaseName: "TodoList")
              .Options;
            fakeContext = new TodoListContext(options);

            fakeContext.Users.AddRange(new List<User>
            {
                new User()
                {
                    Username = "mike",
                    Password = "1234",
                },
                new User()
                {
                    Username = "will",
                    Password = "5678",
                }
            });
            fakeContext.SaveChanges();

            // 建立 Configuration
            var config = new Dictionary<string, string>
                {
                    { "JwtKey", "key" },
                    { "JwtSecret", "secret" }
                };
            fakeConfiguration = new ConfigurationBuilder()
                .AddInMemoryCollection(config)
                .Build();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            fakeContext.Database.EnsureDeleted();
            fakeContext.Dispose();
        }
        
        [TestMethod()]
        public void 測試mock的configuration()
        {
            Assert.AreEqual("key", fakeConfiguration.GetValue<string>("JwtKey"));
            Assert.AreEqual("secret", fakeConfiguration.GetValue<string>("JwtSecret"));
        }

        [TestMethod()]
        public void 取得指定使用者()
        {
            // Arrange
            var service = new AuthService(fakeConfiguration, fakeContext);

            // Act
            var actual = service.GetUser("mike");

            // Assert
            Assert.IsNotNull(actual);
            Assert.AreEqual("mike", actual.Username);
            Assert.AreEqual("1234", actual.Password);
        }

        [TestMethod()]
        public void 建立使用者()
        {
            // Arrange
            var service = new AuthService(fakeConfiguration, fakeContext);

            // Act
            service.CreateUser("devpro", "1234");
            var actual = fakeContext.Users.FirstOrDefault(user => user.Username == "devpro");

            // Assert
            Assert.IsNotNull(actual);
            Assert.IsFalse(String.IsNullOrEmpty(actual.Password));
        }

        [TestMethod]
        public void 檢查使用者帳號密碼是否存在()
        {
            // Arrange
            var service = new AuthService(fakeConfiguration, fakeContext);

            // Act
            Assert.IsFalse(service.IsUsernamePasswordExist("devpro", "1234"));

            service.CreateUser("devpro", "1234");
            var actual = service.IsUsernamePasswordExist("devpro", "1234");

            // Assert
            Assert.IsTrue(actual);
        }
    }
}