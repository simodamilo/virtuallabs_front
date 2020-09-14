import {
  Component,
  ViewChild,
  Output,
  Input,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Assignment, Solution, State } from 'src/app/core';

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.css'],
})
export class StudentAssignmentComponent {

  _assignments: Assignment[];
  _history: Solution[] = [];
  _errorMsg: string;
  solutionFileName: string;
  showReadError: boolean = false;
  showSolutionDeliverable: boolean;
  solutionContent: File;
  currentAssignment: Assignment = {} as Assignment;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) solutionPaginator: MatPaginator;
  @ViewChild("solutionInput") input: ElementRef;

  @Input('assignments')
  set assignments(assignments: Assignment[]) {
    if (assignments != null)
      this._assignments = assignments;
  }
  @Input('history')
  set history(history: Solution[]) {
    if (history != null && this.currentAssignment != null) {
      this._history = history;
      this.checkDeliverable();
    }
  }
  @Input('errorMsg')
  set errorMsg(error: string) {
    this._errorMsg = error;
  }

  @Output('selectedEmitter') selectedEmitter = new EventEmitter<Assignment>();
  @Output('addSolution') solutionEmitter = new EventEmitter<{
    solution: Solution;
    assignment: Assignment;
  }>();

  constructor(public dialog: MatDialog) {
  }

  /**
   * Used to get the file when the student upload it. 
   * 
   * @param file that the student upload.
   */
  onSolutionSelected(file: File) {
    this._errorMsg = "";
    this.solutionContent = file
    file ? this.solutionFileName = file.name : this.solutionFileName = ""
  }

  /**
   * Used the update the solution table when the user click on an assignment.
   */
  assignmentSelected(assignment: Assignment) {
    if (
      this.currentAssignment == null ||
      this.currentAssignment.id != assignment.id
    ) {
      this.selectedEmitter.emit(assignment);
      this.currentAssignment = assignment;
    } else {
      this._history = [];
      this.currentAssignment = null;
      this.setSolution(false, false);
    }
  }

  /**
   * Used to add a solution with status READ when the student view the content of the assignment.
   * 
   * @param assignment selected by the student.
   */
  assignmentReaded(assignment: Assignment) {
    const solution: Solution = {
      content: null,
      state: State.READ,
      deliveryTs: new Date(),
      modifiable: true
    }
    this.solutionEmitter.emit({ solution: solution, assignment: assignment });
  }

  /**
   * Used to add a solution with status DELIVERED when the student add the solution.
   */
  addSolution() {
    if (this.solutionContent != null) {
      const solution: Solution = {
        content: this.solutionContent,
        state: State.DELIVERED,
        deliveryTs: new Date(),
        modifiable: true
      }
      this.solutionEmitter.emit({ solution: solution, assignment: this.currentAssignment });
      this.setSolution(true, false);
    }
    else{
      this._errorMsg = "Select a content";
    }
  }

  /**
   * Used to check if the student can deliver his solution.
   */
  checkDeliverable() {
    if (!this._history.some(solution => solution.grade != null
      && new Date(this.currentAssignment.deadline).getTime() > new Date().getTime())) {
      this._history.length > 1 ? this.setSolution(true, false) : this.setSolution(false, true);
    }
    else {
      this.setSolution(false, false);
    }
  }

  /**
   * Used to handle the status of error or the div to add the solution.
   * 
   * @param deliverableState true show the div.
   * @param errorState true show the error.
   */
  setSolution(deliverableState: boolean, errorState: boolean) {
    this.input ? this.input.nativeElement.value = "" : null;
    this.solutionFileName = ""
    this.solutionContent = null;
    this.showSolutionDeliverable = deliverableState;
    this.showReadError = errorState;
  }

}
