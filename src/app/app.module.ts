import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';  
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { VmsContComponent } from './vm/vms-cont.component';
import { VmsComponent } from './vm/vms.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { RegistrationDialogComponent } from './auth/registration-dialog.component';
import { LoginComponent } from './auth/login.component';
import { TestComponent } from './test.component';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { AuthGuard } from './auth/auth.guard';
import { ProfileDialogComponent } from './shared/profile-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    VmsContComponent,
    VmsComponent,
    RegistrationDialogComponent,
    LoginComponent,
    TestComponent,
    ProfileDialogComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatStepperModule,
    MatSliderModule,
    StudentModule,
    TeacherModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [RegistrationDialogComponent]
})
export class AppModule { }
