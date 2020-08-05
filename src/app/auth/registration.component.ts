import { Component } from '@angular/core';
import { Registration } from './registration.model';
import { AbstractControl, ValidatorFn, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registrationForm: FormGroup;
  regEx = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9].{7,}');
  errorMsg = '';
  hide: boolean = true;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      serial: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.domainValidator()]],
      password: ['', [Validators.required, Validators.pattern(this.regEx)]],
      confirmPassword: ['', this.passwordValidator()]
    });
  }

  registration() {
    if (this.registrationForm.valid) {
      const registration: Registration = {
        name: this.registrationForm.get('name').value,
        surname: this.registrationForm.get('surname').value,
        serial: this.registrationForm.get('serial').value,
        email: this.registrationForm.get('email').value,
        password: this.registrationForm.get('password').value
      };

      this.authService.registration(registration).subscribe(
        () => {
          this.registrationForm.reset()
          this.errorMsg = "";
        },
        (err) => this.errorMsg = err.error.message
      );
    }
  }

  domainValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.registrationForm === undefined)
        return null;
      return this.check() ? { 'domain': { value: control.value } } : null;
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.registrationForm === undefined)
        return null;
      return control.value !== this.registrationForm.get('password').value ? { 'pswConfirm': { value: control.value } } : null;
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
  }

  getErrorEmailMessage() {
    if (this.registrationForm.get('email').hasError('required'))
      return 'You must enter a value';

    if (this.registrationForm.get('email').hasError('domain'))
      return 'Not valid domain';

    return this.registrationForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  getErrorPasswordMessage() {
    if (this.registrationForm.get('password').hasError('required')) {
      return 'You must enter a value';
    }

    return this.registrationForm.get('password').hasError('pattern') ? 'At least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number' : '';
  }

  getErrorConfirmPasswordMessage() {
    if (this.registrationForm.get('password').hasError('required')) {
      return 'You must enter a value';
    }

    return this.registrationForm.get('confirmPassword').hasError('pswConfirm') ? 'Password are not equal' : '';
  }

  private check() {
    const domain = String(this.registrationForm.get('email').value).split('@')[1];
    if (domain === "studenti.polito.it" || domain === "polito.it")
      return false;

    return true;
  }

}
