import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Registration } from './registration.model';
import { tap, shareReplay } from 'rxjs/operators';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }


  login(user: User) {
    console.log("authService.login() " + user.username)
    return this.http.post<any>(`/api/authenticate`, user).pipe(
      tap(res => {
        console.log("Gianmarco sei bellissimo " + res.jwtToken);
        const tkn = JSON.parse(atob(res.jwtToken.split('.')[1]));
        localStorage.setItem("jwt", res.jwtToken);
        localStorage.setItem("expires_at", tkn.exp);
      }),
      shareReplay()
    );
  }

  logout(){
    localStorage.removeItem("jwt");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    console.log("isLoggedIn", localStorage.getItem("expires_at"))
    return moment().isBefore(moment.unix(+localStorage.getItem("expires_at")));
  }

  registration(user: Registration) {
    console.log("registrationService.registration()")
    return this.http.post<Registration>(`/api/register`, user);
  }

}
