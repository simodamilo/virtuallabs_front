import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TVmsContComponent } from './vm/t-vms-cont.component';
import { TVmsComponent } from './vm/t-vms.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    TVmsContComponent,
    TVmsComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class TeacherModule { }
