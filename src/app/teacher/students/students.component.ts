import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Student } from '../../core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Student>;
  colsToDisplay = ['select', 'id', 'name', 'surname', 'group'];
  selection: SelectionModel<Student>;
  selectedAddStudent: Student;
  filteredOptions: Student[];
  private _allStudents: Student[];

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input('allStudents') set allStudents(student: Student[]) {
    this._allStudents = student;
    this.filteredOptions = student;
  }
  @Input('enrolledStudents') set enrolledStudents(students: Student[]) {
    if (students != null) {
      this.dataSource.data = [...students];
    }
  }
  @Output('enrollStudent') addEmitter = new EventEmitter<Student[]>();
  @Output('removeStudent') removeEmitter = new EventEmitter<Student[]>();

  ngOnInit() {
    this.selection = new SelectionModel<Student>(true, []);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  toggleRowsTable(event: MatCheckboxChange, row: Student) {
    this.selection.toggle(row);
  }

  toggleMasterTable() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeStudent() {
    this.removeEmitter.emit(this.selection.selected);
    this.selection.clear();
  }

  displayFn(s: Student): string {
    return `${s.name} ${s.surname} (${s.serial})`;
  }

  customFilter(value: string = '') {
    this.filteredOptions = this._allStudents.filter((s) =>
      value === ''
        ? true
        : `${s.name} ${s.surname} (${s.serial})`
            .toLowerCase()
            .includes(value.toLowerCase())
    );
  }

  studentSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedAddStudent = event.option.value;
  }

  enrollStudent() {
    if (
      this.selectedAddStudent != null &&
      this.dataSource.data.filter((s) => s.serial == this.selectedAddStudent.serial)
        .length == 0
    ) {
      this.addEmitter.emit([this.selectedAddStudent]);
    }
  }
}
