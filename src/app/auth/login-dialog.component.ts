import { Component } from '@angular/core';
import { User } from './user.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from './auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styles: [],
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  regEx = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9].{7,}');
  errorMsg = '';
  hide: boolean = true;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.regEx)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const user: User = {
        username: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value,
      };

      this.authService.login(user).subscribe(
        () => this.dialogRef.close(),
        (err) => this.errorMsg = err.error.message
      );
    }
  }

  getErrorEmailMessage() {
    if (this.loginForm.get('email').hasError('required'))
      return 'You must enter a value';

    return this.loginForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  getErrorPasswordMessage() {
    if (this.loginForm.get('password').hasError('required'))
      return 'You must enter a value';

    return this.loginForm.get('password').hasError('pattern')
      ? 'At least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number'
      : '';
  }
}
