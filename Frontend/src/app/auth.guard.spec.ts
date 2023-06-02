import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('當 local storage 包含 token 時，應該回傳 true', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue('token');
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']) as ActivatedRouteSnapshot;
    const state = jasmine.createSpyObj('RouterStateSnapshot', ['']) as RouterStateSnapshot;

    // Act
    const actual = guard.canActivate(route, state);

    // Assert
    expect(actual).toBeTrue();
  });

  it('當 local storage 不包含 token 時，應該導向 /login', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']) as ActivatedRouteSnapshot;
    const state = jasmine.createSpyObj('RouterStateSnapshot', ['']) as RouterStateSnapshot;
    const expected = TestBed.inject(Router).parseUrl('/login');

    // Act
    const actual = guard.canActivate(route, state);

    // Assert
    expect(actual).toEqual(expected);
  });
});
