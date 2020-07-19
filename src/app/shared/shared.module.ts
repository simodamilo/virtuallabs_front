import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VmsTableComponent } from './vms-table/vms-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ContentDialogComponent } from './content-dialog/content-dialog.component';
import { AssignmentsTableComponent } from './assignments-table/assignments-table.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { SolutionsTableComponent } from './solutions-table/solutions-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentsTableComponent } from './students-table/students-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    VmsTableComponent,
    AssignmentsTableComponent,
    ProfileDialogComponent,
    ContentDialogComponent,
    SolutionsTableComponent,
    StudentsTableComponent
  ],
  imports: [
    CommonModule,
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
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  exports: [
    VmsTableComponent,
    AssignmentsTableComponent,
    ProfileDialogComponent,
    ContentDialogComponent,
    SolutionsTableComponent,
    StudentsTableComponent
  ]
})
export class SharedModule { }
