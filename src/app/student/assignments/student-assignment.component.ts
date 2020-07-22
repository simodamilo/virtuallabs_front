import {
  Component,
  ViewChild,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Assignment, Solution } from 'src/app/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.css'],
})
export class StudentAssignmentComponent {

  assignments$: Assignment[];
  history$: Solution[];
  solution = new FormControl('', Validators.required);

  currentAssignment: Assignment;
  newSolution: Solution = {} as Solution;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) solutionPaginator: MatPaginator;

  @Input('assignments')
  set assignments(assignments: Assignment[]) {
    if (assignments != null) this.assignments$ = assignments;
  }
  @Input('history')
  set history(history: Solution[]) {
    if (history != null && this.currentAssignment!= null) this.history$ = history;
  }

  @Output('selectedEmitter') selectedEmitter = new EventEmitter<Assignment>();
  @Output('addSolution') solutionEmitter = new EventEmitter<{
    solution: Solution;
    assignment: Assignment;
  }>();

  constructor(public dialog: MatDialog) {
  }

  onSolutionSelected(event) {
    this.newSolution.content = event.target.files[0];
  }

  assignmentSelected(assignment: Assignment) {
    if (
      this.currentAssignment == null ||
      this.currentAssignment.id != assignment.id
    ) {
      this.selectedEmitter.emit(assignment);
      this.currentAssignment = assignment;
    } else {
      this.history$ =[];
      this.currentAssignment = null;
    }
  }

  assignmentReaded(assignment: Assignment) {
      this.newSolution.content = null;
      this.newSolution.state = 1;

      this.newSolution.deliveryTs = new Date();
      this.newSolution.modifiable = true;
      this.solutionEmitter.emit({ solution: this.newSolution, assignment: assignment});
  
  }

  addSolution() {
    if(this.solution.valid){
      this.newSolution.state = 2;

      this.newSolution.deliveryTs = new Date();
      this.newSolution.modifiable = true;
      this.solutionEmitter.emit({ solution: this.newSolution, assignment: this.currentAssignment});
      this.solution.reset();
    }
  }

  isSolutionDelivarable(){
    if(this.currentAssignment != null && 
      new Date(this.currentAssignment.deadline).getTime() > new Date().getTime())
      return true;

    return false;
  }
}
