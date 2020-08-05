import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { Assignment, Solution } from '../../core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ContentDialogComponent } from 'src/app/shared/content-dialog/content-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-assignment',
  templateUrl: './teacher-assignment.component.html',
  styleUrls: ['./teacher-assignment.component.css'],
})
export class TeacherAssignmentComponent implements AfterViewInit {
  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = ['student', 'deliveryTs', 'state', 'grade', 'actions'];
  state = ['ALL', 'NULL', 'READ', 'DELIVERED', 'REVIEWED'];
  _assignments: Assignment[];
  _history: Solution[];
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
  selectedValue: string = "ALL";
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
    if (assignments != null)
      this._assignments = assignments;
  }
  @Input('history') set history(history: Solution[]) {
    if (history != null)
      this._history = history;
  }
  @Input("assignmentErrorMsg") set assignmentErrorMsg(error: string) {
    this._assignmentErrorMsg = error;
  }
  @Input("solutionErrorMsg") set solutionErrorMsg(error: string) {
    this._solutionErrorMsg = error;
  }

  @Output('selectedEmitter') selectedEmitter = new EventEmitter<Assignment>();
  @Output('historyEmitter') historyEmitter = new EventEmitter<{ solution: Solution; assignment: Assignment; }>();
  @Output('addAssignment') assignmentEmitter = new EventEmitter<Assignment>();
  @Output('addReview') reviewEmitter = new EventEmitter<{ solution: Solution; assignment: Assignment; }>();

  constructor(public dialog: MatDialog, private fb: FormBuilder) {
    this.assignmentForm = this.fb.group({
      name: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  /**
   * Used to initialize sort paginator and filter once that the view is initilized
   */
  ngAfterViewInit() {
    this.solutionsDataSource.sort = this.sort;
    this.solutionsDataSource.paginator = this.solutionPaginator;
    this.solutionsDataSource.filterPredicate =
      (data: Solution, filter: string) => data.state.toString().toLowerCase() == filter;
  }

  /**
     * Used to open the ContentDialog to display the solution image.
     * 
     * @param solution of which the image is displayed.
     */
  viewContent(solution: Solution) {
    this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
      data: { solution: solution }
    });
  }

  /**
   * Used to filter the datapicker with only correct data.
   * 
   * @param date available in the datapicker.
   */
  myFilter(date: Date | null): boolean {
    return date >= new Date();
  }

  /**
   * 
   * @param date 
   */
  formatDate(date: Date) {
    return moment(date).format('DD-MM-YYYY, HH:mm:ss');
  }

  /**
   * Used to filter the table depending on the state selected in selection field.
   * 
   * @param state currently selected in the field. 
   */
  applyFilter(state: string) {
    this.selectedValue = state
    const filterValue = (this.selectedValue === 'ALL' ? '' : state);

    this.solutionsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.solutionsDataSource.paginator) {
      this.solutionsDataSource.paginator.firstPage();
    }
  }

  /**
   * Used to get the file of the assignment when the teacher upload it. 
   * 
   * @param file that the student upload.
   */
  addAssignmentContent(file: File) {
    this.assignmentContent = file;
    file ? this.assignmentFileName = file.name : this.assignmentFileName = ""
  }

  /**
  * Used to get the file of the solution when the teacher upload it. 
  * 
  * @param file that the student upload.
  */
  addSolutionContent(file: File) {
    this.newReview.content = file
    file ? this.solutionFileName = file.name : this.solutionFileName = ""
  }

  /**
   * Used to properly update the solutions table when a new assignment is clicked
   * or when the teacher deselect the current one.
   */
  assignmentSelected(assignment: Assignment) {
    if (this.showRevision) this.toggleReview(false, null)
    if (
      this.currentAssignment == null ||
      this.currentAssignment.id != assignment.id
    ) {
      this.selectedEmitter.emit(assignment);
      this.isHistoryVisible = false;
      this.currentAssignment = assignment;
    }
    else {
      this.isHistoryVisible = false;
      this.solutionsDataSource.data = [];
      this.currentAssignment = null;
    }
  }

  /**
   * Used to load the history of a solution selected by the teacher.
   * 
   * @param solution currently selected.
   */
  loadHistory(solution: Solution) {
    if (this.currentSolutions === solution && this.isHistoryVisible === true) {
      this.isHistoryVisible = false;
      this.currentSolutions = null;
    } else {
      this.toggleReview(false, solution);
      this.isHistoryVisible = true;
      this.historyEmitter.emit({
        solution: solution,
        assignment: this.currentAssignment,
      });
    }
  }

  /**
   * Used to create a new assignment and pass its value to the container.
   */
  addAssignment() {
    if (this.assignmentForm.valid && this.assignmentContent != null) {
      const assignment: Assignment = {
        name: this.assignmentForm.get('name').value,
        deadline: this.assignmentForm.get('deadline').value,
        content: this.assignmentContent,
        releaseDate: new Date(),
      }

      this.assignmentEmitter.emit(assignment);
      this.assignmentContent = null;
      this.assignmentInput.nativeElement.value = "";
      this.assignmentFileName = ""
      this.assignmentForm.reset();
    }
  }

  /**
   * Used to create a new solution with status REVIEWED and pass its value to the container.
   */
  addReview() {
    this.newReview.student = this.currentSolutions.student;
    this.newReview.deliveryTs = new Date();
    this.newReview.state = 3;
    this.reviewEmitter.emit({ solution: this.newReview, assignment: this.currentAssignment });
    this.toggleReview(false, null);
  }

  /**
   * Used to properly show history and review div.
   * 
   * @param state true to show review div.
   * @param solution currently selected.
   */
  toggleReview(state: boolean, solution: Solution) {
    this.isHistoryVisible = false;
    this.currentSolutions = solution;
    if (this.showRevision) {
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
      return 'Enter a valid value'
  }
}
