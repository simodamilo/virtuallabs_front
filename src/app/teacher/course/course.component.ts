import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Student, Teacher, Course } from '../../core';
import { CourseDialogComponent } from 'src/app/shared/course-dialog/course-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements AfterViewInit{
  dataSource: MatTableDataSource<Teacher> = new MatTableDataSource();
  colsToDisplay = ['select', 'serial', 'name', 'surname'];
  selection: SelectionModel<Teacher>;
  toRemove: Student[] = [];
  selectedAddStudent: Student;
  showButton: Boolean = false;
  _allStudents: Student[];
  _enrolledStudents: Student[];
  _allTeachers: Teacher[];
  _ownerTeachers: Teacher[];
  isActive: boolean;
  _course: Course = {} as Course;
  _errorMsgStudent: string;
  _errorMsgTeacher: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("csvInput") csvInput: ElementRef;

  constructor(public courseDialog: MatDialog, public confirmDialog: MatDialog) {
    this.selection = new SelectionModel<Student>(true, []);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  @Input('errorMsgStudent') set errorMsgStudent(err: string) {
    this._errorMsgStudent = err;
  }
  @Input('errorMsgTeacher') set errorMsgTeacher(err: string) {
    this._errorMsgTeacher = err;
  }
  @Input('allStudents') set allStudents(students: Student[]) {
    this._allStudents = students;
  }
  @Input('allTeachers') set allTeachers(teachers: Teacher[]) {
    this._allTeachers = teachers;
  }
  @Input('course') set courseStatus(course: Course) {
    if(course != null){
      this._course = course
      this.isActive = course.enabled;
    }
  }
  @Input('enrolledStudents') set enrolledStudents(students: Student[]) {
    if (students != null) {
      this._enrolledStudents = [...students];
      this.toRemove = [];
    }
  }
  @Input('ownerTeachers') set ownerTeachers(teachers: Teacher[]) {
    if (teachers != null) {
      this.dataSource.data = [...teachers];
      this.selection.clear();
    }
  }

  @Output('enroll') addEmitter = new EventEmitter<Student | Teacher>();
  @Output('removeStudents') removeStudentsEmitter = new EventEmitter<Student[]>();
  @Output('removeTeachers') removeTeachersEmitter = new EventEmitter<Teacher[]>();
  @Output('updateEnrolled') updateEmitter = new EventEmitter<boolean>();

  changeSelection(event: Student[]) {
    this.toRemove = [...event];
  }

  removeStudents() {
    this.removeStudentsEmitter.emit(this.toRemove);
  }

  removeTeachers() {
    this.removeTeachersEmitter.emit(this.selection.selected);
  }

  selectedOption(option: Student | Teacher){
      this.addEmitter.emit(option)
  }

  openCourseDialog() {
    const dialogRef = this.courseDialog.open(CourseDialogComponent, {
      width: '300px',
      data: this._course,
    });

    dialogRef.afterClosed().subscribe(course => {
      if(course != null)
        this._course = course;
    });
  }

  deleteCourse() {
    this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {course: this._course},
    });
  }

  
  toggleRowsTable(event: MatCheckboxChange, row: Student) {
    this.selection.toggle(row);
  }

  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  masterToggle(checkboxChange: MatCheckboxChange) {
    if(this.isEntirePageSelected()) {
      this.selection.deselect(...this.getPageData());
      this.showButton = false;
    } else {
      this.selection.select(...this.getPageData())
      this.showButton = true;
    }
  }

  selectAll() {
    this.selection.select(...this.dataSource.data);
  }

  onChangeEvent(event) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {csv: event.target.files[0], courseName: this._course.name},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res)
        this.updateEmitter.emit(true);
      this.csvInput.nativeElement.value = "";
    });
  }
}