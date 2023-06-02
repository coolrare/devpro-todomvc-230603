using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Moq;
using Backend.Services;
using Backend.Models.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Tests
{
    [TestClass()]
    public class LoginControllerTests
    {
        [TestMethod()]
        public void 當帳號密碼正確時回傳200以及accessToken()
        {
            // Arrange
            var username = "mike";
            var password = "123456";
            var token = "fake token";
            var mockAuthService = new Mock<IAuthService>();
            mockAuthService.Setup(x => x.IsUsernamePasswordExist(username, password)).Returns(true);
            mockAuthService.Setup(x => x.CreateAccessToken(username)).Returns(token);
            
            var controller = new LoginController(mockAuthService.Object);

            // Act
            var actual = controller.Login(new LoginRequest()
            {
                Username = username,
                Password = password
            });

            // Assert
            mockAuthService.Verify(service => service.IsUsernamePasswordExist(username, password), Times.Once());
            mockAuthService.Verify(service => service.CreateAccessToken(username), Times.Once());

            var actualResult = actual as OkObjectResult;
            Assert.IsNotNull(actualResult);

            var actualResponseBody = actualResult.Value as LoginResponse;
            Assert.IsNotNull(actualResponseBody);
            Assert.AreEqual(token, actualResponseBody.AccessToken);
        }

        [TestMethod()]
        public void 當帳號密碼不正確時回傳401()
        {
            // Arrange
            var username = "mike";
            var password = "123456";
            var token = "fake token";
            var mockAuthService = new Mock<IAuthService>();
            mockAuthService.Setup(x => x.IsUsernamePasswordExist(username, password)).Returns(false);
            mockAuthService.Setup(x => x.CreateAccessToken(username)).Returns(token);

            var controller = new LoginController(mockAuthService.Object);

            // Act
            var actual = controller.Login(new LoginRequest()
            {
                Username = username,
                Password = password
            });

            // Assert
            mockAuthService.Verify(service => service.IsUsernamePasswordExist(username, password), Times.Once());
            mockAuthService.Verify(service => service.CreateAccessToken(username), Times.Never());

            var actualResult = actual as UnauthorizedResult;
            Assert.IsNotNull(actualResult);
        }
    }
}