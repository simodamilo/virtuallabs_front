import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import { Assignment, Solution } from '../../core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ContentDialogComponent } from 'src/app/shared/content-dialog/content-dialog.component';
import { empty } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-assignment',
  templateUrl: './teacher-assignment.component.html',
  styleUrls: ['./teacher-assignment.component.css'],
})
export class TeacherAssignmentComponent implements AfterViewInit {
  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = ['student', 'deliveryTs', 'state', 'grade', 'actions'];
  state = ['ALL', 'NULL','READ','DELIVERED','REVIEWED'];
  assignments$: Assignment[];
  history$: Solution[];

  showRevision: boolean = false;
  modifiable: boolean = false;
  isHistoryVisible: boolean = false;
  assignmentContent: any;

  currentAssignment: Assignment;
  currentSolutions: Solution;
  newReview: Solution = {} as Solution;
  assignmentForm: FormGroup;
  assignmentFileName: string = "";
  solutionFileName: string = "";
  selectedValue: string ="ALL";
  _solutionErrorMsg: string;
  _assignmentErrorMsg: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) solutionPaginator: MatPaginator;
  @ViewChild("assignmentInput") assignmentInput: ElementRef;
  @ViewChild("solutionInput") solutionInput: ElementRef;

  @Input('solutions') 
  set solutions(solutions: Solution[]) {
    if (solutions != null) this.solutionsDataSource.data = [...solutions];
  }
  @Input('assignments') 
  set assignments(assignments: Assignment[]) {
    if (assignments != null) this.assignments$ = assignments;
  }
  @Input('history') set history(history: Solution[]) {
    if (history != null) this.history$ = history;
  }
  @Input("assignmentErrorMsg") set assignmentErrorMsg(error: string){
    this._assignmentErrorMsg = error;
  }
  @Input("solutionErrorMsg") set solutionErrorMsg(error: string){
    this._solutionErrorMsg=error;
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

  constructor(public dialog: MatDialog, private fb: FormBuilder) { 
    this.assignmentForm = this.fb.group({
      name: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.solutionsDataSource.sort = this.sort;
    this.solutionsDataSource.paginator = this.solutionPaginator;
    this.solutionsDataSource.filterPredicate = 
    (data: Solution, filter: string) => data.state.toString().toLowerCase() == filter;
  }

  viewContent(solution: Solution) {
    this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
      data:{solution: solution}
    });
  }

  myFilter(d: Date | null): boolean {
    return d >= new Date();
  }

  formatDate(date: Date) {
    return moment(date).format('DD-MM-YYYY, HH:mm:ss');
  }

  applyFilter(state: string) {
    this.selectedValue = state
    const filterValue = (this.selectedValue === 'ALL' ? '' :  state);
  
    this.solutionsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.solutionsDataSource.paginator) {
      this.solutionsDataSource.paginator.firstPage();
    }
  }

  addAssignmentContent(file: File){
    this.assignmentContent = file;
    file ? this.assignmentFileName = file.name : this.assignmentFileName =""
  }
  addSolutionContent(file: File){
    this.newReview.content = file
    file ? this.solutionFileName = file.name : this.solutionFileName =""
  }

  assignmentSelected(assignment: Assignment) {
    if(this.showRevision) this.toggleReview(false, null)
    if (
      this.currentAssignment == null ||
      this.currentAssignment.id != assignment.id
    ) {
      this.selectedEmitter.emit(assignment);
      this.isHistoryVisible = false;
      this.currentAssignment = assignment;
    }
    else{
      this.isHistoryVisible= false;
      this.solutionsDataSource.data = [];
      this.currentAssignment=null;
    }
  }

  loadHistory(solution: Solution) {
    if(this.currentSolutions === solution && this.isHistoryVisible === true){
      this.isHistoryVisible = false;
      this.currentSolutions = null;
    }else{
      this.toggleReview(false, solution);
      this.isHistoryVisible = true;
      this.historyEmitter.emit({
        solution: solution,
        assignment: this.currentAssignment,
      });
    }
  }

  addAssignment() {
    if (this.assignmentForm.valid && this.assignmentContent != null) {
      const assignment: Assignment = {
        name: this.assignmentForm.get('name').value,
        deadline: this.assignmentForm.get('deadline').value,
        content: this.assignmentContent,
        releaseDate: new Date(), 
      }      
      this.assignmentEmitter.emit(assignment);
      this.assignmentContent=null;
      this.assignmentInput.nativeElement.value = "";
      this.assignmentFileName = ""
      this.assignmentForm.reset();

    }
  }

  addReview() {
    this.newReview.student= this.currentSolutions.student;
    this.newReview.deliveryTs = new Date();
    this.newReview.state = 3;
    this.reviewEmitter.emit({solution: this.newReview, assignment: this.currentAssignment});
    this.toggleReview(false, null);

  }

  toggleReview(state: boolean, solution: Solution) {
    this.isHistoryVisible = false;
    this.currentSolutions = solution;
    if(this.showRevision){
      this.newReview = {} as Solution 
      this.solutionInput.nativeElement.value = "";
      this.solutionFileName = ""
    }
    this.showRevision = state;
  }

  getErrorNameMessage() {
    if (this.assignmentForm.get('name').hasError('required'))
      return 'You must enter a value';
  }

  getErrorDeadlineMessage() {
    if (this.assignmentForm.get('deadline').hasError('required'))
      return 'You must enter a value';
  }
}
