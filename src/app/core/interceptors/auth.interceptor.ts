import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  /**
   * Used to insert in the header the authorization field in the format "Bearer " plus the jwt token.
   * 
   * @param request in which the header is inserted.
   * @param next the handler of the http requests.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.isLoggedIn()) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem("jwt"))
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}