import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentDialogComponent } from '../content-dialog/content-dialog.component';
import { Solution } from 'src/app/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-solutions-table',
  templateUrl: './solutions-table.component.html',
  styleUrls: ['./solutions-table.component.css']
})
export class SolutionsTableComponent implements OnInit {
  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = [ 'deliveryTs', 'state', 'grade', 'actions'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  @Input('solutions') set solutions(solutions: Solution[]) {
    if (solutions != null) 
      this.solutionsDataSource.data = [...solutions];
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.solutionsDataSource.sort = this.sort;
  }

  viewContent(solution: Solution) {
    this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
      data:{solution: solution}
    });
  }

  formatDate(date: Date) {
    return moment(date).format('DD-MM-YYYY, HH:mm:ss');
  }
}
