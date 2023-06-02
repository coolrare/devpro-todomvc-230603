import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginResult } from './login-result';
import { LoginUser } from './login-user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(user: LoginUser) {
    return this.httpClient.post<LoginResult>(`${environment.api}/login`, user);
  }
}
