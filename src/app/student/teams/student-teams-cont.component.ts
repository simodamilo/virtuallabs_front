import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team, TeamService, StudentService, Student, Token } from 'src/app/core';
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
  errorMsg: string;
  errorRequestMsg: string;
  courseName: string;

  constructor(private route: ActivatedRoute,
    private teamService: TeamService,
    private studentService: StudentService) { }

  /**
   * Used to initialize some values when the component starts.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseName = params['courseName'];
      this.team$ = this.teamService.getStudentTeamByCourse(this.courseName);
      this.availableStudents$ = this.studentService.getAvailableStudents(this.courseName);
      this.pendingTeams$ = this.teamService.getPendingTeams(this.courseName);
    });
  }

  /**
   * Used to propose a team by adding the authenticated user to the list of members.
   *  
   * @param event contains the name, the timeout and the students of the team. 
   */
  proposeTeam(event: any) {
    this.errorMsg = "";
    let studentSerials = event.students.map((student: Student) => student.serial);
    studentSerials.push(localStorage.getItem("serial"));
    this.teamService.proposeTeam(this.courseName, event.name, event.timeout, studentSerials).subscribe(
      () => {
        this.availableStudents$ = this.studentService.getAvailableStudents(this.courseName);
        this.pendingTeams$ = this.teamService.getPendingTeams(this.courseName);
      },
      (err) => {
        this.availableStudents$ = this.studentService.getAvailableStudents(this.courseName);
        this.errorMsg = err.error.message;
      }
    );
  }

  /**
   * Used to accept the request of a team.
   * 
   * @param event contains the token for the specific team.
   */
  acceptTeam(event: Token) {
    this.errorRequestMsg = "";
    this.teamService.acceptTeam(event).subscribe(
      () => {
        this.team$ = this.teamService.getStudentTeamByCourse(this.courseName);
        this.pendingTeams$ = this.teamService.getPendingTeams(this.courseName);
      },
      (err) => this.errorRequestMsg = err.error.message
    );
  }

  /**
   * Used to reject the request of a team.
   * 
   * @param event contains the token for the specific team.
   */
  rejectTeam(event: Token) {
    this.errorRequestMsg = "";
    this.teamService.rejectTeam(event).subscribe(
      () => this.pendingTeams$ = this.teamService.getPendingTeams(this.courseName),
      (err) => this.errorRequestMsg = err.error.message
    );
  }
}
