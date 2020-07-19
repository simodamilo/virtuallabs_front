import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StudentsComponent } from './students/students.component';
import { TeacherAssignmentComponent } from './assignments/teacher-assignment.component';
import { TeacherAssignmentContComponent } from './assignments/teacher-assignment-cont.component';
import { TeacherVmsContComponent } from './vms/teacher-vms-cont.component';
import { TeacherVmsComponent } from './vms/teacher-vms.component';
import { StudentsContComponent } from './students/students-cont.component';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TeacherVmsContComponent,
    TeacherVmsComponent,
    StudentsContComponent,
    StudentsComponent,
    TeacherAssignmentContComponent,
    TeacherAssignmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TeacherRoutingModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatOptionModule,
    MatAutocompleteModule
  ],
  providers: [MatDatepickerModule]
})
export class TeacherModule { }
