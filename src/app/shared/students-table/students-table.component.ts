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

  /**
   * Used to initialize the table column depending on the role of the user.
   */
  ngOnInit() {
    if (localStorage.getItem("role") === "student") {
      this.isStudent = true;
      this.colsToDisplay = ['select', 'serial', 'name', 'surname'];
    } else {
      this.isStudent = false;
      this.colsToDisplay = ['select', 'serial', 'name', 'surname', 'group'];
    }
  }

  /**
   * Used to initialize sort and paginator once that the view is initilized
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Used to toggle the row of the table selected and pass its value to the container.
   * 
   * @param row selected bu the user.
   */
  toggleRowsTable(row: Student) {
    this.selection.toggle(row);
    this.selectedStudentsEmitter.emit(this.selection.selected);
  }

  /**
   * Used to get the page selected.
   */
  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }

  /**
   * Used to check if all the rows of the page are selected.
   */
  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  /**
   * Used to toggle all the rows of the page and show the button to toggle all the table
   * and pass its value to the container.
   */
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

  /**
   * Select all the table rows.
   */
  selectAll() {
    this.selection.select(...this.dataSource.data);
  }

}
