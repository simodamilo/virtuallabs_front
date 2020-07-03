import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    console.log("Guard called", state.url);
    return this.checkLogin(state.url);
  }

  checkLogin(url: string){
    if(this.auth.isLoggedIn()) {
      console.log("logged");
      return true;
    } else {
      console.log("not logged");
      localStorage.setItem('nextRoute', url);
      this.router.navigate(['home'], { queryParams: {doLogin: true}});
      return false;
    }
  }
  
}
