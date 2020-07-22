import { Component, OnInit } from '@angular/core';
import { Student, StudentService} from '../../core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
})
export class StudentsContComponent implements OnInit {
  allStudents: Observable<Student[]>;
  enrolledStudents: Observable<Student[]>;

  courseName: string;
  constructor(private studentService: StudentService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.allStudents = this.studentService.getAllStudents();
    this.route.params.subscribe(url =>{
      this.courseName = url["courseName"];
      this.enrolledStudents = this.studentService.getEnrolled(url["courseName"])
    })
  }

   enrollStudent(students: Student[]) {
     this.studentService
      .enroll(students, this.courseName)
      .subscribe(
        () => this.enrolledStudents = this.studentService.getEnrolled(this.courseName)
      );
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
}
