import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { Assignment, Solution } from '../../core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ContentDialogComponent } from 'src/app/shared/content-dialog/content-dialog.component';
import { empty } from 'rxjs';

@Component({
  selector: 'app-teacher-assignment',
  templateUrl: './teacher-assignment.component.html',
  styleUrls: ['./teacher-assignment.component.css'],
})
export class TeacherAssignmentComponent implements OnInit, AfterViewInit {
  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = ['student', 'state', 'deliveryTs', 'modifiable', 'actions'];
  state = ['NULL','READ','DELIVERED','REVIEWED'];
  assignments$: Assignment[];
  history$: Solution[];

  showRevision: boolean = false;
  modifiable: boolean = false;
  isHistoryVisible: boolean = false;

  currentAssignment: Assignment;
  currentSolutions: Solution;
  newAssignment: Assignment = {} as Assignment;
  newReview: Solution = {} as Solution;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) solutionPaginator: MatPaginator;
  @ViewChild("solutionInput") solutionInput: ElementRef;
  @ViewChild("assignmentInput") assignmentInput: ElementRef;

  @Input('solutions') set solutions(solutions: Solution[]) {
    if (solutions != null) this.solutionsDataSource.data = [...solutions];
  }
  @Input('assignments') set assignments(assignments: Assignment[]) {
    if (assignments != null) this.assignments$ = assignments;
  }
  @Input('history') set history(history: Solution[]) {
    if (history != null) this.history$ = history;
  }

  @Output('selectedEmitter') selectedEmitter = new EventEmitter<Assignment>();
  @Output('historyEmitter') historyEmitter = new EventEmitter<{
    solution: Solution;
    assignment: Assignment;
  }>();
  @Output('addAssignment') assignmentEmitter = new EventEmitter<Assignment>();
  @Output('addReview') reviewEmitter = new EventEmitter<{
    solution: Solution;
    assignment: Assignment;
  }>();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.solutionsDataSource.sort = this.sort;
    this.solutionsDataSource.paginator = this.solutionPaginator;
    this.solutionsDataSource.filterPredicate = 
    (data: Solution, filter: string) => data.state.toString().toLowerCase() == filter;

  }

  viewContent(assignment: Assignment) {
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
    });
  }

  myFilter(d: Date | null): boolean {
    return d >= new Date();
  }

  formatDate(date: Date) {
    return moment(date).format('DD-MM-YYYY, hh:mm:ss');
  }

  changeModifiable() {
    if (this.modifiable) this.modifiable = false;
    else this.modifiable = true;
  }

  displayFn(s: string): string {
    return `${s}`;
  }

  applyFilter(state: string) {
    const filterValue = state;
    this.solutionsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.solutionsDataSource.paginator) {
      this.solutionsDataSource.paginator.firstPage();
    }
  }

  onAssingmentSelected(event){
    this.newAssignment.content = event.target.files[0]
  }

  onSolutionSelected(event){
    this.newReview.content = event.target.files[0]
  }

  assignmentSelected(assignment: Assignment) {
    if (
      this.currentAssignment == null ||
      this.currentAssignment.id != assignment.id
    ) {
      this.selectedEmitter.emit(assignment);
      this.isHistoryVisible = false;
      this.currentAssignment = assignment;
      this.showRevision = false;
    }
    else{
      this.solutionsDataSource.data = [];
      this.currentAssignment=null;
    }
  }

  loadHistory(solution: Solution) {
    this.showRevision = false;
    this.currentSolutions = solution;
    this.isHistoryVisible = true;
    this.historyEmitter.emit({
      solution: solution,
      assignment: this.currentAssignment,
    });
  }

  toggleReview(state: boolean, solution?: Solution) {
    this.isHistoryVisible = false;
    this.currentSolutions = solution;
    this.newReview = {} as Solution 
    this.showRevision = state;
  }

  addAssignment() {
    this.newAssignment.releaseDate = new Date();
    this.assignmentEmitter.emit(this.newAssignment);
    this.newAssignment = {} as Assignment 
    this.assignmentInput.nativeElement.value = "";
  }

  addReview() {
    this.newReview.student= this.currentSolutions.student;
    this.newReview.deliveryTs = new Date();
    this.newReview.state = 3;
    this.reviewEmitter.emit({solution: this.newReview, assignment: this.currentAssignment});
    this.newReview = {} as Solution 
    this.solutionInput.nativeElement.value = "";
  }
}
