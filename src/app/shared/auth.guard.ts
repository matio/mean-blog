import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


import { LocalStorageService, LOCALSTORAGE_KEY } from './services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.localStorageService.has(LOCALSTORAGE_KEY.TOKEN)) {
      return true;
    }

    // ログイン後に元々表示しようとしていた画面を表示させる
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
