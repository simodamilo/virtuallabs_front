import { Component, OnInit } from '@angular/core';
import { Registration } from './registration.model';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent {

  registrationForm: FormGroup;
  regEx = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9].{7,}');
  errorMsg = '';
  hide: boolean = true;

  constructor(public dialogRef: MatDialogRef<RegistrationDialogComponent>, private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      serial: ['', [Validators.required, this.serialValidator()]],
      email: ['', [Validators.required, Validators.email, this.emailValidator()]],
      password: ['', [Validators.required, Validators.pattern(this.regEx)]],
      confirmPassword: ['', this.passwordValidator()]
    });
  }

  serialValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(this.registrationForm === undefined)
        return null;
      return control.value != String(this.registrationForm.get('email').value).split('@')[0] ? {'match': {value: control.value}} : null;
    };
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(this.registrationForm === undefined)
        return null;
      return String(control.value).split('@')[0] != this.registrationForm.get('serial').value ? {'match': {value: control.value}} : null;
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(this.registrationForm === undefined)
        return null;
      return control.value !== this.registrationForm.get('password').value ? {'pswConfirm': {value: control.value}} : null;
    };
  }


  getErrorNameMessage() {
    if (this.registrationForm.get('name').hasError('required')) {
      return 'You must enter a value';
    }
  }

  getErrorSurnameMessage() {
    if (this.registrationForm.get('surname').hasError('required')) {
      return 'You must enter a value';
    }
  }

  getErrorSerialMessage() {
    if (this.registrationForm.get('serial').hasError('required')) {
      return 'You must enter a value';
    }

    return this.registrationForm.get('serial').hasError('match') ? 'Error' : '';
  }
   
  getErrorEmailMessage() {
    if (this.registrationForm.get('email').hasError('required'))
      return 'You must enter a value';

    if(this.registrationForm.get('email').hasError('match'))
      return 'Error';
  
    return this.registrationForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  getErrorPasswordMessage() {
    if (this.registrationForm.get('password').hasError('required')) {
      return 'You must enter a value';
    }
  
    return this.registrationForm.get('password').hasError('pattern') ? 'Password must contains at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number' : '';
  }

  getErrorConfirmPasswordMessage() {
    if (this.registrationForm.get('password').hasError('required')) {
      return 'You must enter a value';
    }
  
    return this.registrationForm.get('confirmPassword').hasError('pswConfirm') ? 'Password are not equal' : '';
  }


  registration() {
    console.log(String(this.registrationForm.get('email').value).split('@')[0]);
    if (this.registrationForm.status !== 'INVALID') {
      var registration: Registration = {
        name: this.registrationForm.get('name').value,
        surname: this.registrationForm.get('surname').value,
        serial: this.registrationForm.get('serial').value,
        email: this.registrationForm.get('email').value, 
        password: this.registrationForm.get('password').value};
      
      this.authService.registration(registration).subscribe(
        ok => {
          console.log(ok);
          this.dialogRef.close(true);
        },
        err => {
          console.log(err);
          this.errorMsg = 'Registration failed!';
        }
      );
    }
  }

}

