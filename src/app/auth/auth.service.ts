import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { tap, shareReplay } from 'rxjs/operators';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }


  login(user: User) {
    console.log("authService.login()")
    return this.http.post<any>(`/api/login`, user).pipe(
      tap(res => {
        const tkn = JSON.parse(atob(res.accessToken.split('.')[1]));
        localStorage.setItem("jwt", res.accessToken);
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

}
