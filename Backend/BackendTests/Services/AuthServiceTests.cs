using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Models.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

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
           
        [TestMethod()]
        public void GetUserTest()
        {
            // Arrange
            var service = new AuthService(fakeConfiguration, fakeContext);

            // Act
            var actaul = service.GetUser("mike");

            // Arrange
            Assert.AreEqual("1234", actaul.Password);
        }
    }
}