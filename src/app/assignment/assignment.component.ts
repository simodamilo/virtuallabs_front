import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Assignment, Solution, Student } from '../core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PreviewDialogComponent } from '../shared/preview-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) solutionPaginator: MatPaginator;
  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = ['student', 'state', 'deliveryTs', 'modifiable', 'view'];
  assignments$: Assignment[];

  @Input('solutions') set solutions(solutions: Solution[]) {
    if (solutions != null) 
      this.solutionsDataSource.data = [...solutions];
  }
  @Input('assignments') set assignments(assignments: Assignment[]) {
    if (assignments != null) 
      this.assignments$ = assignments;
  }
  @Output('selectedEmitter') selectedEmitter = new EventEmitter<Assignment>();
  @Output('addAssignment') addEmitter = new EventEmitter<Assignment>();

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.solutionsDataSource.sort = this.sort;
    this.solutionsDataSource.paginator = this.solutionPaginator;
  }

  viewContent(assignment: Assignment){
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel'
    });
  }

  myFilter(d: Date | null): boolean {
    return d >= new Date()
  }

  addAssignment(name: string, date: Date){
    console.log(name, date)
    const assignment: Assignment = {
      name: name,
      releaseDate: new Date(),
      deadline: moment(date).toDate()
    }
    this.addEmitter.emit(assignment);
  }

  formatDate(date: Date) {
    return moment(date).format("yyyy-MM-DD")
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.solutionsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.solutionsDataSource.paginator) {
      this.solutionsDataSource.paginator.firstPage();
    }
  }

  assignmentSelected($event: Assignment){
    this.selectedEmitter.emit($event)
  }
}
