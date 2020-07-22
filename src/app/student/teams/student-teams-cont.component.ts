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
  pendingTeams$: Observable<Team[]>
  availableStudents$: Observable<Student[]>
  course: Course;
  errorMsg: string;
  errorRequestMsg: string;

  constructor(private route: ActivatedRoute,
    private teamService: TeamService,
    private studentService: StudentService,
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getCourse(params['courseName']);
      this.getTeam(params['courseName']);
      this.getAvailableStudents(params['courseName']);
      this.getPendingTeams(params['courseName']);
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

  getPendingTeams(courseName: string) {
    this.pendingTeams$ = this.teamService.getPendingTeams(courseName);
  }

  proposeTeam(event) {
    let studentSerials = event.students.map((student: Student) => student.serial);
    studentSerials.push(localStorage.getItem('email').split('@')[0]);
    if(studentSerials.length < this.course.min || studentSerials.length > this.course.max){
      this.errorMsg = "Course constraints are not respected";
    } else {
      this.teamService.proposeTeam(this.course.name, event.name, event.timeout, studentSerials).subscribe(
        team => {
          this.errorMsg = "";
          this.getAvailableStudents(this.course.name);
          this.getPendingTeams(this.course.name);
        },
        err => {
          this.errorMsg = "Some problems occur, please try again!"
        }
      );
    }
  }

  acceptTeam(event) {
    this.teamService.acceptTeam(event).subscribe(
      () => {
        this.getTeam(this.course.name);
        this.getPendingTeams(this.course.name);
        this.errorRequestMsg = "";
      },
      () => {
        this.errorRequestMsg = "It is not possible to accept the request";
      }
    );
  }

  rejectTeam(event) {
    this.teamService.rejectTeam(event).subscribe(
      () => {
        this.getPendingTeams(this.course.name);
        this.errorRequestMsg = "";
      },
      () => {
        this.errorRequestMsg = "It is not possible to reject the request";
      }
    );
  }
}
