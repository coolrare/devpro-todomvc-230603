import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { LoginUser } from './login-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private loginService: LoginService
  ) {}

  login() {
    this.loadingService.loading();
    this.loginService
      .login(this.user.value as LoginUser)
      .pipe(finalize(() => this.loadingService.unloading()))
      .subscribe({
        next: (result) => {
          localStorage.setItem('token', result.accessToken);
          this.router.navigate(['/']);
        },
        error: () => {
          alert('登入失敗');
        },
      });
  }
}
