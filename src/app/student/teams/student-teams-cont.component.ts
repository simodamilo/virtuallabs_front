import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team, TeamService, StudentService, Student, Course, CourseService } from 'src/app/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-teams-cont',
  templateUrl: './student-teams-cont.component.html',
  styles: []
})
export class StudentTeamsContComponent implements OnInit {

  team$: Observable<Team>;
  availableStudents$: Observable<Student[]>
  course: Course;
  errorMsg: string;

  constructor(private route: ActivatedRoute,
    private teamService: TeamService,
    private studentService: StudentService,
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getCourse(params['courseName']);
      this.getTeam(params['courseName']);
      this.getAvailableStudents(params['courseName']);
    });
  }

  getCourse(courseName: string) {
    this.courseService.getCourseById(courseName).subscribe(c => {
      this.course = c;
    });
  }

  getTeam(courseName: string) {
    this.team$ = this.teamService.getStudentTeamByCourse(courseName);
  }

  getAvailableStudents(courseName: string) {
    this.availableStudents$ = this.studentService.getAvailable(courseName);
  }

  proposeTeam(event) {
    let studentSerials = event.students.map(student => student.serial);
    studentSerials.push(localStorage.getItem('email').split('@')[0]);
    if(studentSerials.length < this.course.min || studentSerials.length > this.course.max){
      this.errorMsg = "Course constraints are not respected";
    } else {
      this.teamService.proposeTeam(this.course.name, event.name, event.timeout, studentSerials).subscribe(
        team => {
          this.errorMsg = "";
          this.getAvailableStudents(this.course.name);
          // si potrebbe aggiornare tutte le richieste dell'utente pending, per vedere anche la sua richiesta
        },
        err => {
          this.errorMsg = "Some problems occur, please try again!"
        }
      );
    }
  }
}
