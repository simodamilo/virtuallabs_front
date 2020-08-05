import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Team, Student, Token } from 'src/app/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-teams',
  templateUrl: './student-teams.component.html',
  styleUrls: ['./student-teams.component.css']
})
export class StudentTeamsComponent {

  displayedColumns: string[] = ['name', 'surname', 'serial'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  teamsDisplayedColumns: string[] = ['name', 'members', 'actions'];
  teamsDataSource: MatTableDataSource<Team> = new MatTableDataSource<Team>();
  proposeTeamForm: FormGroup;
  showTeamInfo: Boolean = false;
  showTeamProposals: Boolean = false;
  _team: Team = {} as Team;
  _availableStudents: Student[];
  _errorMsg: string;
  _errorRequestMsg: string;
  proposedStudents: Student[] = [];

  @Input('team')
  set team(team: Team) {
    if (team !== null) {
      this._team = team;
      this.dataSource.data = [...team.members];
      this.showTeamInfo = true;
      this.showTeamProposals = false;
    } else {
      this.showTeamInfo = false;
      this.showTeamProposals = true;
    }
  }

  @Input('availableStudents')
  set availableStudents(students: Student[]) {
    if (students != null) {
      this._availableStudents = [...students];
    }
  }

  @Input('errorMsg') set errorMsg(errorMsg: string) {
    this._errorMsg = errorMsg;
    if (this._errorMsg === "") {
      this.proposeTeamForm.reset();
      Object.keys(this.proposeTeamForm.controls).forEach(key => {
        this.proposeTeamForm.get(key).setErrors(null);
      });
      this.proposedStudents = [];
    }
  }

  @Input('errorRequestMsg')
  set errorRequestMsg(errorRequestMsg: string) {
    if (errorRequestMsg !== null) {
      this._errorRequestMsg = errorRequestMsg;
    }
  }

  @Input('pendingTeams')
  set teams(teams: Team[]) {
    if (teams !== null) {
      this.teamsDataSource.data = [...teams];
    } else {
      this.teamsDataSource.data = [];
    }
  }

  @Output('proposeTeam') proposeTeamEmitter = new EventEmitter<{ name: string, timeout: number, students: Student[] }>();
  @Output('acceptToken') acceptToken = new EventEmitter<Token>();
  @Output('rejectToken') rejectToken = new EventEmitter<Token>();

  constructor(private fb: FormBuilder) {
    this.proposeTeamForm = this.fb.group({
      name: ['', Validators.required],
      timeout: ['', Validators.required]
    });
  }

  changeSelection(event: Student[]) {
    this.proposedStudents = [...event];
  }

  proposeTeam() {
    if (this.proposeTeamForm.get('name').valid && this.proposeTeamForm.get('timeout').valid)
      this.proposeTeamEmitter.emit({ name: this.proposeTeamForm.get('name').value, timeout: this.proposeTeamForm.get('timeout').value, students: this.proposedStudents });
  }

  isNotAccepted(team: Team): Boolean {
    const student = team.members.find(student => student.serial == localStorage.getItem("serial"));
    return (student.teamToken == null || student.teamToken.status === 1) ? false : true;
  }

  accept(team: Team) {
    team.members.forEach(student => {
      if (student.serial === localStorage.getItem("serial"))
        this.acceptToken.emit(student.teamToken);
    });
  }

  reject(team: Team) {
    team.members.forEach(student => {
      if (student.serial === localStorage.getItem("serial"))
        this.rejectToken.emit(student.teamToken);
    });
  }

  getErrorNameMessage() {
    if (this.proposeTeamForm.get('name').hasError('required'))
      return 'You must enter a value';
  }

  getErrorTimeoutMessage() {
    if (this.proposeTeamForm.get('timeout').hasError('required'))
      return 'You must enter a value';
  }
}
