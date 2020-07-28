import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Student, Teacher, Course } from '../../core';
import { CourseDialogComponent } from 'src/app/shared/course-dialog/course-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent{
  toRemove: Student[] = [];
  selectedAddStudent: Student;
  allStudents$: Student[];
  enrolledStudents$: Student[];
  allTeachers$: Teacher[];
  isActive: boolean;
  _course: Course;

  constructor(public courseDialog: MatDialog,) {
  }

  @Input('allStudents') set allStudents(students: Student[]) {
    this.allStudents$ = students;
  }
  @Input('allTeachers') set allTeachers(teachers: Teacher[]) {
    this.allTeachers$ = teachers;
  }
  @Input('course') set courseStatus(course: Course) {
    if(course != null){
    this._course = course
    this.isActive = course.enabled;
    }
  }
  @Input('enrolledStudents') set enrolledStudents(students: Student[]) {
    if (students != null) {
      this.enrolledStudents$ = [...students];
    }
  }
  @Output('enroll') addEmitter = new EventEmitter<Student | Teacher>();
  @Output('removeStudent') removeEmitter = new EventEmitter<Student[]>();
  @Output('modifyCourse') courseEmitter =  new EventEmitter<Course>();
  //@Output('removeTeacher') removeTeacherEmitter = new EventEmitter<Teacher>();

  changeSelection(event: Student[]) {
    this.toRemove = [...event];
  }

  removeStudent() {
    this.removeEmitter.emit(this.toRemove);
  }

  selectedOption(option: Student | Teacher){
      this.addEmitter.emit(option)
  }

  openCourseDialog() {
    this.courseDialog.open(CourseDialogComponent, {
      width: '300px',
      position: { top: '176px', left: '15%' },
      data: this._course,
    });
  }
}
