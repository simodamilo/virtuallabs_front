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
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements AfterViewInit {

  dataSource: MatTableDataSource<Teacher> = new MatTableDataSource();
  colsToDisplay = ['select', 'serial', 'name', 'surname'];
  selection: SelectionModel<Teacher>;
  toRemove: Student[] = [];
  selectedAddStudent: Student;
  showButton: Boolean = false;
  isActive: boolean;
  _studentErrorMsg: string = "";
  _teacherErrorMsg: string = "";
  _allStudents: Student[];
  _allTeachers: Teacher[];
  _course: Course = {} as Course;
  _enrolledStudents: Student[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("csvInput") csvInput: ElementRef;

  @Input('errorMsgStudent') set errorMsgStudent(err: string) {
    this._studentErrorMsg = err;
  }
  @Input('errorMsgTeacher') set errorMsgTeacher(err: string) {
    this._teacherErrorMsg = err;
  }
  @Input('allStudents') set allStudents(students: Student[]) {
    this._allStudents = students;
  }
  @Input('allTeachers') set allTeachers(teachers: Teacher[]) {
    this._allTeachers = teachers;
  }
  @Input('course') set courseStatus(course: Course) {
    if (course != null) {
      this._course = course
      this.isActive = course.enabled;
    }
  }
  @Input('enrolledStudents') set enrolledStudents(students: Student[]) {
    if (students != null) {
      this._enrolledStudents = [...students];
      this.toRemove = [];
    } else {
      this._enrolledStudents = [];
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

  constructor(public courseDialog: MatDialog, public confirmDialog: MatDialog) {
    this.selection = new SelectionModel<Student | Teacher>(true, []);
  }

  /**
   * Used to initialize sort and paginator once that the view is initilized.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Used to open the dialog to modify the course informatiom.
   */
  openCourseDialog() {
    const dialogRef = this.courseDialog.open(CourseDialogComponent, {
      width: '300px',
      data: this._course,
    });

    dialogRef.afterClosed().subscribe(course => {
      if (course != null)
        this._course = course;
    });
  }

  /**
   * Used to open the confirm dialog when the teacher delete a course.
   */
  deleteCourse() {
    this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { course: this._course },
    });
  }

  /**
   * Used to pass to the container the student/teacher selected in the fields.
   * 
   * @param option contains the selected student or teacher. 
   */
  selectedOption(option: Student | Teacher) {
    this._studentErrorMsg = "";
    this.addEmitter.emit(option)
  }

  /**
   * Used to toggle the row of the table.
   * 
   * @param row selected.
   */
  toggleRowsTable(row: Student | Teacher) {
    this._studentErrorMsg = "";
    this.selection.toggle(row);
  }

  /**
   * Used to pass to the container the list of teachers.
   */
  removeTeachers() {
    this.removeTeachersEmitter.emit(this.selection.selected);
  }

  /**
   * Used to open the confirm dialog when the teacher upload a csv file to enroll the students.
   */
  onChangeEvent(event) {
    this._studentErrorMsg = "";
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { csv: event.target.files[0], courseName: this._course.name },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      res ? this.updateEmitter.emit(true) : this._studentErrorMsg = "There is a problem, please try again or check the course"
      this.csvInput.nativeElement.value = "";
    });
  }

  /**
   * Used to create the list of students to remove.
   */
  changeSelection(event: Student[]) {
    this.toRemove = [...event];
  }

  /**
   * Used to pass to the container the list of students.
   */
  removeStudents() {
    this._studentErrorMsg = "";
    this.removeStudentsEmitter.emit(this.toRemove);
    this.toRemove = [];
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
  }

  /**
   * Select all the table rows.
   */
  selectAll() {
    this.selection.select(...this.dataSource.data);
  }

}
