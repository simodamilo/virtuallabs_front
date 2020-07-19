import { Component, OnInit, AfterViewInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Team, Student } from 'src/app/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-teams',
  templateUrl: './student-teams.component.html',
  styleUrls: ['./student-teams.component.css']
})
export class StudentTeamsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'surname', 'serial'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();

  proposeTeamForm: FormGroup;
  showTeamInfo: Boolean = false;
  showTeamProposals: Boolean = false;
  _team: Team = {} as Team; 
  _availableStudents: Student[];
  _errorMsg: string;
  proposedStudents: Student[] = [];

  constructor(private fb: FormBuilder) { 
    this.proposeTeamForm = this.fb.group({
      name: ['', Validators.required],
      timeout: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  @Input()
  set team(team: Team){
    if(team !== null) {
      this._team = team;
      this.dataSource.data = [...team.members];
      this.showTeamInfo = true;
      this.showTeamProposals = false;
    } else {
      this.showTeamInfo = false;
      this.showTeamProposals = true;
    }
  }

  @Input('availableStudents') set availableStudents(students: Student[]) {
    if (students != null) {
      this._availableStudents = [...students];
    }
  }

  @Input('errorMsg') set errorMsg(errorMsg: string) {
    this._errorMsg = errorMsg;
    if(this._errorMsg === "") {
      this.proposeTeamForm.reset();
      Object.keys(this.proposeTeamForm.controls).forEach(key => {
        this.proposeTeamForm.get(key).setErrors(null);
      });
      this.proposedStudents = [];
    }
  }

  @Output('proposeTeam') proposeTeamEmitter = new EventEmitter<{name: string, timeout: number, students: Student[]}>();

  getErrorNameMessage() {
    if (this.proposeTeamForm.get('name').hasError('required'))
      return 'You must enter a value';
  }

  getErrorTimeoutMessage() {
    if (this.proposeTeamForm.get('timeout').hasError('required'))
      return 'You must enter a value';
  }


  changeSelection(event: Student[]) {
    this.proposedStudents = [...event];
  }

  proposeTeam(teamName: string, timeout: number) {
    console.log("Name: " + teamName + " Timeout: " + timeout + " Selected: " + this.proposedStudents);
    if (this.proposeTeamForm.get('name').valid && this.proposeTeamForm.get('timeout').valid) {
      this.proposeTeamEmitter.emit({name: teamName, timeout: timeout, students: this.proposedStudents});
    }
  }
}
