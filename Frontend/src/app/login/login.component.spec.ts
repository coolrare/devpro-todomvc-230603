import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { LoadingService } from '../loading.service';
import { Observable, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loginService = TestBed.inject(LoginService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('當按下登入按鈕時，應該呼叫 loginComponent.login() 和 loginService.login() 一次', () => {
    // Arrange
    spyOn(component, 'login').and.callThrough();
    spyOn(loginService, 'login').and.returnValue(of({ accessToken: '' }));
    const username = fixture.debugElement.query(By.css('[name=username]'));
    const password = fixture.debugElement.query(By.css('[name=password]'));

    // Act
    username.nativeElement.value = 'mike';
    username.nativeElement.dispatchEvent(new Event('input'));
    password.nativeElement.value = '123456';
    password.nativeElement.dispatchEvent(new Event('input'));

    fixture.debugElement
      .query(By.css('form.main'))
      .triggerEventHandler('submit');

    fixture.detectChanges();

    // Assert
    expect(component.login).toHaveBeenCalledTimes(1);
    expect(loginService.login).toHaveBeenCalledOnceWith({
      username: 'mike',
      password: '123456',
    });
  });

  it('當登入成功時，應該設定名為 token 的 localStorage，並轉到首頁', () => {
    // Arrange
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    spyOn(localStorage, 'setItem');
    spyOn(loginService, 'login').and.callFake(() =>
      of({ accessToken: '123456' })
    );

    const expectedLocalStorageKey = 'token';
    const expectedLocalStorageValue = '123456';
    const expectedNavigatePath = ['/'];

    // Act
    component.login();

    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith(
      expectedLocalStorageKey,
      expectedLocalStorageValue
    );
    expect(router.navigate).toHaveBeenCalledWith(expectedNavigatePath);
  });

  it('當登入失敗時，提示「登入失敗」訊息', () => {
    // Arrange
    spyOn(window, 'alert');
    spyOn(loginService, 'login').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    // Act
    component.login();

    // Assert
    expect(window.alert).toHaveBeenCalledWith('登入失敗');
  });

  it('當按下登入按鈕時，應該先呼叫 loadingService.loading() 之後再呼叫 loadingService.unloading()', () => {
    // Arrange
    const callOrder: Array<string> = [];
    const loadingService = TestBed.inject(LoadingService);
    spyOn(loadingService, 'loading').and.callFake(() =>
      callOrder.push('loading')
    );
    spyOn(loadingService, 'unloading').and.callFake(() =>
      callOrder.push('unloading')
    );
    spyOn(loginService, 'login').and.returnValue(of({ accessToken: '' }));

    // Act
    component.login();

    // Assert
    expect(callOrder).toEqual(['loading', 'unloading']);
  });
});
