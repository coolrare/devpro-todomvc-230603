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

  it('當localStorage有包含token時，允許通過', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue('123456');

    // Act
    const routeDummy = {} as ActivatedRouteSnapshot;
    const stateDummy = {} as RouterStateSnapshot;

    const actual = guard.canActivate(routeDummy, stateDummy);

    // Assert
    expect(actual).toBeTrue();
  });

  it('當localStorage不包含token時，轉到 /login 頁面', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const router = TestBed.inject(Router);
    const expected = router.parseUrl('/login');

    // Act
    const routeDummy = jasmine.createSpyObj('route', ['']) as ActivatedRouteSnapshot;
    const stateDummy = jasmine.createSpyObj('state', ['']) as RouterStateSnapshot;

    const actual = guard.canActivate(routeDummy, stateDummy);
    // Assert
    expect(actual).toEqual(expected);
  });

});
