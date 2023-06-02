import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LoginService);
    httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'post');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('執行 login() 時，應該呼叫 httpClient.post() 一次', () => {
    // Arrange
    const user = { username: 'mike', password: '123456' };

    // Act
    service.login(user);

    // Assert
    expect(httpClient.post).toHaveBeenCalledTimes(1);
    expect(httpClient.post).toHaveBeenCalledWith(`${environment.api}/login`, { username: 'mike', password: '123456'});
  });
});
