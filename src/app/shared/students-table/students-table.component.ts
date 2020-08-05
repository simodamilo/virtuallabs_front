import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Student, Course } from 'src/app/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styles: []
})
export class StudentsTableComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Student> = new MatTableDataSource();
  colsToDisplay: string[];
  selection: SelectionModel<Student>;
  isStudent: Boolean = true;
  showButton: Boolean = false;
  _course: Course;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input()
  set students(students: Student[]) {
    if (students != null) {
      this.dataSource.data = [...students];
      this.selection.clear();
    }
  }

  @Input()
  set course(course: Course) {
    if (course != null) {
      this._course = course;
    }
  }

  @Output('selectedStudents') selectedStudentsEmitter = new EventEmitter<Student[]>();

  constructor() {
    this.selection = new SelectionModel<Student>(true, []);
  }

  ngOnInit() {
    if (localStorage.getItem("role") === "student") {
      this.isStudent = true;
      this.colsToDisplay = ['select', 'serial', 'name', 'surname'];
    } else {
      this.isStudent = false;
      this.colsToDisplay = ['select', 'serial', 'name', 'surname', 'group'];
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  toggleRowsTable(event: MatCheckboxChange, row: Student) {
    this.selection.toggle(row);
    this.selectedStudentsEmitter.emit(this.selection.selected);
  }

  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  masterToggle() {
    if (this.isEntirePageSelected()) {
      this.selection.deselect(...this.getPageData());
      this.showButton = false;
    } else {
      this.selection.select(...this.getPageData())
      this.showButton = true;
    }

    this.selectedStudentsEmitter.emit(this.selection.selected);
  }

  selectAll() {
    this.selection.select(...this.dataSource.data);
  }

}
