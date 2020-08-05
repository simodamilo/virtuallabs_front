import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
} from '@angular/core';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { Assignment } from '../../core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ContentDialogComponent } from '../content-dialog/content-dialog.component';

@Component({
  selector: 'app-assignments-table',
  templateUrl: './assignments-table.component.html',
  styleUrls: ['./assignments-table.component.css'],
})
export class AssignmentsTableComponent implements OnInit, AfterViewInit {

  assignmentsDataSource = new MatTableDataSource<Assignment>();
  assignmentCols = ['name', 'releaseDate', 'deadline', 'view'];
  assignmentSelection: SelectionModel<Assignment>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input('assignments')
  set assignments(assignments: Assignment[]) {
    if (assignments != null)
      this.assignmentsDataSource.data = [...assignments]
  }
  @Output('assignmentSelected') selectionEmitter = new EventEmitter<Assignment>();
  @Output('assignmentReaded') readEmitter = new EventEmitter<Assignment>();

  constructor(public dialog: MatDialog) { }

  /**
   * Initialize the selection model.
   */
  ngOnInit(): void {
    this.assignmentSelection = new SelectionModel<Assignment>(false, []);
  }

  /**
   * Initialize the sort once that the view is initiated.
   */
  ngAfterViewInit() {
    this.assignmentsDataSource.sort = this.sort;
  }

  /**
   * Used to display the assignment image.
   * 
   * @param assignment of which image must be displayed.
   */
  viewContent(assignment: Assignment) {
    if (localStorage.getItem('role') == "student") { this.readEmitter.emit(assignment) }
    this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
      data: { assignment: assignment }
    });
  }

  /**
   * Used to change the format of the selected date.
   * 
   * @param date that is printed.
   */
  formatDate(date: Date) {
    return moment(date).format('DD-MM-yyyy');
  }

  /**
   * Used to pass the selected assignment to the component that use the table.
   * 
   * @param row of the selected assignment.
   */
  assignmentSelected(row: Assignment) {
    this.selectionEmitter.emit(row);
    this.assignmentSelection.toggle(row);
  }
}
