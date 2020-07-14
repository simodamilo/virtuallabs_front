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
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { RegistrationDialogComponent } from './auth/registration-dialog.component';
import { TestComponent } from './test.component';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { AuthGuard } from './auth/auth.guard';
import { MatSelectModule } from '@angular/material/select';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ProfileDialogComponent } from './shared/profile-dialog.component';
import { StudentsContComponent } from './teacher/students-cont.component';
import { StudentsComponent } from './shared/students.component';
import { PreviewDialogComponent } from './shared/preview-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AssignmentModule } from './assignment/assignment.module';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
    VmsContComponent,
    VmsComponent,
    RegistrationDialogComponent,
    LoginComponent,
    TestComponent,
    ProfileDialogComponent,
    StudentsComponent,
    StudentsContComponent,
    PreviewDialogComponent,
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
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatStepperModule,
    MatSliderModule,
    StudentModule,
    TeacherModule,
    AuthModule,
    SharedModule,
    MatSelectModule
    AssignmentModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, MatDatepickerModule],
  bootstrap: [AppComponent],
  entryComponents: [RegistrationDialogComponent]
})
export class AppModule { }
