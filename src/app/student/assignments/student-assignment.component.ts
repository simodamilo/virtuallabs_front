import {
  Component,
  OnInit,
  ViewChild,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Assignment, Solution, SolutionService } from 'src/app/core';
import { MatTableDataSource } from '@angular/material/table';
import { ContentDialogComponent } from 'src/app/shared/content-dialog/content-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.css'],
})
export class StudentAssignmentComponent implements OnInit {

  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = ['student', 'state', 'deliveryTs', 'modifiable', 'actions'];

  assignments$: Assignment[];
  history$: Solution[];

  isValid: boolean = false;
  currentAssignment: Assignment;
  newSolution: Solution = {} as Solution;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) solutionPaginator: MatPaginator;

  @Input('assignments')
  set assignments(assignments: Assignment[]) {
    if (assignments != null) 
    this.assignments$ = assignments;
  }
  @Input('history') set history(history: Solution[]) {
    if (history != null) 
    this.history$ = history;
  }

  @Output('selectedEmitter') selectedEmitter = new EventEmitter<Assignment>();
  @Output('addSolution') solutionEmitter = new EventEmitter<{
    solution: Solution;
    assignment: Assignment;
  }>();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.solutionsDataSource.sort = this.sort;
    this.solutionsDataSource.paginator = this.solutionPaginator;
  }

  formatDate(date: Date) {
    return moment(date).format('yyyy-MM-DD');
  }


  onSolutionSelected(event){
    this.newSolution.content = event.target.files[0]
  }

  assignmentSelected(assignment: Assignment) {
    if (
      this.currentAssignment == null ||
      this.currentAssignment.id != assignment.id
    ) {
      if(new Date(assignment.deadline).getTime() > new Date().getTime()){
        this.isValid = true;
      }
      this.selectedEmitter.emit(assignment);
      this.currentAssignment = assignment;
    }
    else{
      this.isValid = false;
      this.solutionsDataSource.data = [];
      this.currentAssignment=null;
    }
  }

  addSolution(){
    this.newSolution.deliveryTs = new Date();
    this.newSolution.state = 2;
    this.newSolution.modifiable= true;
    this.solutionEmitter.emit({solution: this.newSolution, assignment: this.currentAssignment})
  }
}
