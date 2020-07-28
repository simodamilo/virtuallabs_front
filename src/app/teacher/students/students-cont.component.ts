import { Component, OnInit } from '@angular/core';
import { Student, StudentService, Teacher, TeacherService, Course, CourseService} from '../../core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
})
export class StudentsContComponent implements OnInit {
  allStudents: Observable<Student[]>;
  allTeachers: Observable<Teacher[]>;
  enrolledStudents: Observable<Student[]>;
  course:Observable<Course>

  courseName: string;
  constructor(private studentService: StudentService,private teacherService: TeacherService, private courseService: CourseService , private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.allStudents = this.studentService.getAllStudents();
    this.allTeachers = this.teacherService.getAllTeachers();
    this.route.params.subscribe(url =>{
      this.courseName = url["courseName"];
      this.course = this.courseService.getCourse(url["courseName"]);
      this.enrolledStudents = this.studentService.getEnrolled(url["courseName"])
    })
  }

  enroll(option: Student | Teacher) {
    option.serial.charAt(0)== "s"
    ? this.studentService
        .enrollStudent(option, this.courseName)
        .subscribe(
        () => this.enrolledStudents = this.studentService.getEnrolled(this.courseName))
    : this.teacherService
        .assignTeacher(option, this.courseName)
        .subscribe(() => console.log("lista professori?"))
  }

  enrollCsv(file: File) {
    this.studentService
     .enrollCSV(file, this.courseName)
     .subscribe(
       () => this.enrolledStudents = this.studentService.getEnrolled(this.courseName)
     );
  }
  

  removeStudent(students: Student[]) {
    this.studentService
      .remove(students, this.courseName)
      .subscribe(
        () => this.enrolledStudents = this.studentService.getEnrolled(this.courseName)
      );
  }   

  changeCourse(course: Course){
    this.courseService.modifyCourse(course).subscribe(
      () => this.course = this.courseService.getCourse(this.courseName)
    )
  }
}
