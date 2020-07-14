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
import { PreviewDialogComponent } from '../../shared/preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-assignments-table',
  templateUrl: './assignments-table.component.html',
  styleUrls: ['./assignments-table.component.css'],
})
export class AssignmentsTableComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input('assignments') set assignments(assignments: Assignment[]) {
    if (assignments != null) this.assignmentsDataSource.data = [...assignments];
  }
  @Output('assignmentSelected') selectionEmitter = new EventEmitter<Assignment>();

  assignmentsDataSource = new MatTableDataSource<Assignment>();
  assignmentCols = ['name', 'releaseDate', 'deadline', 'view'];
  assignmentSelection: SelectionModel<Assignment>;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.assignmentSelection = new SelectionModel<Assignment>(false, []);
  }

  ngAfterViewInit() {
    this.assignmentsDataSource.sort = this.sort;
  }

  viewContent(assignment: Assignment) {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
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
