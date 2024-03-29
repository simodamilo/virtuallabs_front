import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VmsTableComponent } from './vms-table/vms-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ContentDialogComponent } from './content-dialog/content-dialog.component';
import { AssignmentsTableComponent } from './assignments-table/assignments-table.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { SolutionsTableComponent } from './solutions-table/solutions-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentsTableComponent } from './students-table/students-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'

@NgModule({
  declarations: [
    VmsTableComponent,
    AssignmentsTableComponent,
    ProfileDialogComponent,
    ContentDialogComponent,
    SolutionsTableComponent,
    StudentsTableComponent,
    AutocompleteComponent,
    CourseDialogComponent,
    ConfirmDialogComponent
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
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  exports: [
    VmsTableComponent,
    AssignmentsTableComponent,
    ProfileDialogComponent,
    ContentDialogComponent,
    SolutionsTableComponent,
    StudentsTableComponent,
    AutocompleteComponent,
    CourseDialogComponent
  ]
})
export class SharedModule { }
