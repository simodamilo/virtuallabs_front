import { Component } from '@angular/core';
import { User } from './user.model';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
     private authService: AuthService, private router: Router) { }

  errorMsg = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',
  [
    Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9].{7,}')
   ]);

   
  getErrorEmailMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
  
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorPasswordMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }
  
    return this.password.hasError('pattern') ? 'Password must contains at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number' : '';
  }


  login() {
    if (this.email.valid && this.password.valid) {
      console.log("login-dialog.login()")
      var user: User = {username: this.email.value, password: this.password.value};
      
      this.authService.login(user).subscribe(
        jwt => {
          console.log(jwt);
          this.dialogRef.close();
        },
        err => {
          console.log(err);
          this.errorMsg = 'Email or password is not correct!';
        }
      );
    }
  }

}
