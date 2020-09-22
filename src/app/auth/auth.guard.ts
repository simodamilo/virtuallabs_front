import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  /**
   * Used to check if the user if correclty authenticated, otherwise redirect to the home.
   * 
   * @param next  contains information about the url.
   * @param state contains information about the url. 
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['home']);
      return false;
    }

    if (next.url[0].path !== localStorage.getItem("role")) {
      this.router.navigate(['home']);
      return false;
    }

    return true;
  }
}
