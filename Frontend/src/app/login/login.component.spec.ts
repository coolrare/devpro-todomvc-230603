import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoadingService } from '../loading.service';
import { LoginService } from './login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [LoginComponent],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('呼叫login方法時，會顯示loading畫面', () => {
    // Arrange
    const loadingService = TestBed.inject(LoadingService);
    spyOn(loadingService, 'loading');
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.returnValue(of({ accessToken: '' }));

    // Act
    component.login();

    // Assert
    expect(loadingService.loading).toHaveBeenCalled();
  });

  it('呼叫login方法時，會呼叫 loginService.login', () => {
    // Arrange
    const loadingService = TestBed.inject(LoadingService);
    spyOn(loadingService, 'loading');
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.returnValue(of({ accessToken: '' }));

    // Act
    component.user.controls.username.setValue('mike');
    component.user.controls.password.setValue('123456');
    component.login();

    // Assert
    expect(loginService.login).toHaveBeenCalledWith({
      username: 'mike',
      password: '123456',
    });
  });

  it('當輸入完帳號密碼並下登入時，要呼叫loginService.login', () => {
    // Arrange
    const loadingService = TestBed.inject(LoadingService);
    spyOn(loadingService, 'loading');
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.returnValue(of({ accessToken: '' }));

    // Act
    const username = fixture.debugElement.query(By.css('input[name=username]'));
    username.nativeElement.value = 'mike';
    username.nativeElement.dispatchEvent(new Event('input'));

    const password = fixture.debugElement.query(By.css('input[name=password]'));
    password.nativeElement.value = '123456';
    password.nativeElement.dispatchEvent(new Event('input'));

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit');
    fixture.detectChanges();

    // Assert
    expect(loginService.login).toHaveBeenCalledWith({
      username: 'mike',
      password: '123456',
    });
  });

  it('當登入成功的時候，應該將回傳結果的 accessToke 設定到 localStorage 內，並且轉到首頁', () => {
    // Arrange
    const loadingService = TestBed.inject(LoadingService);
    spyOn(loadingService, 'loading');
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.returnValue(
      of({ accessToken: 'fake token' })
    );
    spyOn(localStorage, 'setItem');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    // Act
    component.login();

    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake token');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('當登入失敗的時候，應該提示登入失敗訊息', () => {
    // Arrange
    const loadingService = TestBed.inject(LoadingService);
    spyOn(loadingService, 'loading');
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.returnValue(
      throwError(() => {
        throw new Error('test');
      })
    );
    spyOn(window, 'alert');

    // Act
    component.login();

    // Assert
    expect(window.alert).toHaveBeenCalledWith('登入失敗');
  });

  it('當呼叫 login 方法時，執行順序為 loading -> login -> unloading', () => {
    // Arrange
    const expected = ['loading', 'login', 'unloading'];
    const actual: string[] = [];

    const loadingService = TestBed.inject(LoadingService);
    spyOn(loadingService, 'loading').and.callFake(() => {
      actual.push('loading');
    });
    spyOn(loadingService, 'unloading').and.callFake(() => {
      actual.push('unloading');
    });

    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.callFake(() => {
      actual.push('login');
      return of({ accessToken: ''});
    });

    // Act
    component.login();

    // Assert
    expect(actual).toEqual(expected);
  })
});
