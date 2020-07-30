import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Registration } from './registration.model';
import { tap, shareReplay, map } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable, observable, of, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  startUp(){
    this.isLoggedIn() 
    ? this.isAuthenticatedSubject.next(true)
    : this.isAuthenticatedSubject.next(false)
  } 

  public isLoggedIn() {
    if(localStorage.getItem("jwt") && moment().isBefore(moment.unix(+localStorage.getItem("expires_at")))){
      return true;
    }
    else{
      this.logout()
      return false;
    }
  }

  login(user: User) {
    return this.http.post<any>(`/api/authenticate`, user).pipe(
      tap(res => {
        const tkn = JSON.parse(atob(res.jwtToken.split('.')[1]));
        localStorage.setItem("jwt", res.jwtToken);
        localStorage.setItem("expires_at", tkn.exp);
        localStorage.setItem("serial", tkn.sub.split("@")[0]);
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
    localStorage.removeItem("serial")
    this.isAuthenticatedSubject.next(false);
  }

  registration(user: Registration) {
    return this.http.post<Registration>(`/api/register`, user);
  }
}
