import { TestBed } from '@angular/core/testing';

import { ApiInterceptor } from './api.interceptor';
import { HttpHandler, HttpRequest } from '@angular/common/http';

describe('ApiInterceptor', () => {
  let interceptor: ApiInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiInterceptor],
    });
    interceptor = TestBed.inject(ApiInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('當intercept被呼叫時，next.handle會處理request，並塞入新的token到header', () => {
    // Arrange
    const expectedToken = 'abcde';
    spyOn(localStorage, 'getItem').and.returnValue(expectedToken);
    const httpRequest = new HttpRequest('GET', 'https://api');

    const nextStub = <HttpHandler>{
      handle: (req: HttpRequest<any>) => {
        // Assert
        expect(req.headers.get('Authorization')).toBe(
          `Bearer ${expectedToken}`
        );
      },
    };

    // Act
    interceptor.intercept(httpRequest, nextStub);
  });
});
