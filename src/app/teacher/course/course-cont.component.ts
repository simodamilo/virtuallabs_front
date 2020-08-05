import { Component, OnInit } from '@angular/core';
import { Student, StudentService, Teacher, TeacherService, Course, CourseService } from '../../core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-cont',
  templateUrl: './course-cont.component.html',
})
export class CourseContComponent implements OnInit {
  allStudents$: Observable<Student[]>;
  allTeachers$: Observable<Teacher[]>;
  enrolledStudents$: Observable<Student[]>;
  ownerTeachers$: Observable<Teacher[]>;
  course$: Observable<Course>
  courseName: string;
  errorMsgStudent: string;
  errorMsgTeacher: string;

  constructor(private studentService: StudentService,
    private teacherService: TeacherService,
    private courseService: CourseService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(url => {
      this.courseName = url["courseName"];
      this.allStudents$ = this.studentService.getAllStudents(this.courseName);
      this.allTeachers$ = this.teacherService.getAllTeachers(this.courseName);
      this.course$ = this.courseService.getCourse(this.courseName);
      this.enrolledStudents$ = this.studentService.getEnrolledStudents(this.courseName);
      this.ownerTeachers$ = this.teacherService.getCourseOwners(this.courseName);
    })
  }

  enroll(option: Student | Teacher) {
    this.resetErrors();
    option.serial.charAt(0) == "s"
    ? this.studentService.addStudentToCourse(option, this.courseName).subscribe(
      () => this.updateStudents(),
      (err) => this.errorMsgStudent = err.error.message)
    : this.teacherService.addTeacherToCourse(option, this.courseName).subscribe(
      () => this.updateTeachers(),
      (err) => this.errorMsgTeacher = err.error.message);
  }

  removeStudents(students: Student[]) {
    this.resetErrors();
    this.studentService.deleteStudentFromCourse(students, this.courseName).subscribe(
      () => this.updateStudents(),
      (err) => this.errorMsgStudent = err.error.message);
  }

  removeTeachers(teachers: Teacher[]) {
    this.resetErrors();
    this.teacherService.deleteTeacherFromCourse(teachers, this.courseName).subscribe(
      () => {
        this.updateTeachers();
        if(teachers.some(teacher => teacher.serial == localStorage.getItem('serial')))
          this.courseService.changeCourse();
      },
      (err) => this.errorMsgTeacher = err.error.message);
  }

  updateStudents() {
    this.enrolledStudents$ = this.studentService.getEnrolledStudents(this.courseName);
    this.allStudents$ = this.studentService.getAllStudents(this.courseName);
  }

  updateTeachers() {
    this.ownerTeachers$ = this.teacherService.getCourseOwners(this.courseName);
    this.allTeachers$ = this.teacherService.getAllTeachers(this.courseName);
  }

  resetErrors() {
    this.errorMsgStudent = "";
    this.errorMsgTeacher = "";
  }
}
