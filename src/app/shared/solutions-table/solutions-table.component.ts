import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentDialogComponent } from '../content-dialog/content-dialog.component';
import { Solution } from 'src/app/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-solutions-table',
  templateUrl: './solutions-table.component.html',
  styleUrls: ['./solutions-table.component.css']
})
export class SolutionsTableComponent implements AfterViewInit {
  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = [ 'deliveryTs', 'state', 'grade', 'actions'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  
  @Input('solutions') set solutions(solutions: Solution[]) {
    if (solutions != null) 
      this.solutionsDataSource.data = [...solutions];
  }

  constructor(public dialog: MatDialog) {}


  ngAfterViewInit() {
    this.solutionsDataSource.sort = this.sort;
    this.solutionsDataSource.paginator = this.paginator;
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
