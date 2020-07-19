import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { SharedModule } from '../shared/shared.module';
import { StudentVmsContComponent } from './vms/student-vms-cont.component';
import { StudentVmsComponent } from './vms/student-vms.component';
import { StudentTeamsContComponent } from './teams/student-teams-cont.component';
import { StudentTeamsComponent } from './teams/student-teams.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    StudentVmsContComponent,
    StudentVmsComponent,
    StudentTeamsContComponent,
    StudentTeamsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StudentRoutingModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    FormsModule,
    MatStepperModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatListModule,
    ReactiveFormsModule
  ]
})
export class StudentModule { }
