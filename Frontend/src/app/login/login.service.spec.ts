import { LoginUser } from './login-user';
import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LoginService);
    httpClient= TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('當login方法呼叫時，應該要呼叫httpClient.post', () => {
    // Arrange
    const loginUser:LoginUser = {
      username: 'mike',
      password: '123456'
    };
    spyOn(httpClient, 'post');
    const expectedEndpoint = `${environment.api}/login`;

    // Act
    service.login(loginUser);

    // Assert
    expect(httpClient.post).toHaveBeenCalledTimes(1);
    expect(httpClient.post).toHaveBeenCalledWith(expectedEndpoint, loginUser);
  })
});
