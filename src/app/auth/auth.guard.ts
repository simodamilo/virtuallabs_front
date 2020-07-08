import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    if(!this.auth.isLoggedIn())
      return false;

    if(next.data.expectedRole !== localStorage.getItem("role"))
      return false;
    return true;
  }
  
}
