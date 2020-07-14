import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Registration } from './registration.model';
import { tap, shareReplay } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable, observable, of, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post<any>(`/api/authenticate`, user).pipe(
      tap(res => {
        const tkn = JSON.parse(atob(res.jwtToken.split('.')[1]));
        localStorage.setItem("jwt", res.jwtToken);
        localStorage.setItem("expires_at", tkn.exp);
        localStorage.setItem("email", tkn.sub);
        if(tkn.sub.split("@")[1] === "studenti.polito.it")
          localStorage.setItem("role", "student");
        else
          localStorage.setItem("role", "teacher");
        this.isAuthenticatedSubject.next(true);
      }),
      shareReplay()
    );
  }

  logout(){
    localStorage.removeItem("jwt");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("role");
    this.isAuthenticatedSubject.next(false);
  }

  public isLoggedIn() {
    console.log("isLoggedIn", localStorage.getItem("expires_at"))
    return moment().isBefore(moment.unix(+localStorage.getItem("expires_at")));
  }

  registration(user: Registration) {
    console.log("registrationService.registration() " + user.email);
    return this.http.post<Registration>(`/api/register`, user);
  }

}
