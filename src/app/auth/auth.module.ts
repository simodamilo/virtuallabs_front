import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { LoginDialogComponent } from './login-dialog.component';
import { RegistrationComponent } from './registration.component';

@NgModule({
  declarations: [
    LoginDialogComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class AuthModule { }