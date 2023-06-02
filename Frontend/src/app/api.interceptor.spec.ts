import { TestBed } from '@angular/core/testing';

import { HttpHandler, HttpRequest } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';

describe('ApiInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ApiInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: ApiInterceptor = TestBed.inject(ApiInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('應該在 HTTP 請求前，加上 Authorization 標頭', () => {
    // Arrange
    const interceptor = TestBed.inject(ApiInterceptor);

    spyOn(localStorage, 'getItem').and.returnValue('123456');

    const request = new HttpRequest('GET', 'https://foo');
    // 驗證重點：在執行 intercept 時，確定呼叫的 request 包含 authorization header
    const handler = <HttpHandler>{
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.get('Authorization')).toBe('Bearer 123456');
      },
    };

    // Act
    interceptor.intercept(request, handler);
  });
});
