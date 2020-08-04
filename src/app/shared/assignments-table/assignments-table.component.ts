import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
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
export class AssignmentsTableComponent implements OnInit {

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

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.assignmentSelection = new SelectionModel<Assignment>(false, []);
  }

  ngAfterViewInit() {
    this.assignmentsDataSource.sort = this.sort;
  }

  viewContent( assignment:Assignment) {
    if(localStorage.getItem('role')== "student"){this.readEmitter.emit(assignment)}
    this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
      data:{ assignment: assignment }
    });
  }

  formatDate(date: Date) {
    return moment(date).format('DD-MM-yyyy');
  }

  assignmentSelected(row: Assignment) {
    this.selectionEmitter.emit(row);
    this.assignmentSelection.toggle(row);
  }
}
