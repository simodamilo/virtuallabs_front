import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';
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
  styles: []
})
export class SolutionsTableComponent implements AfterViewInit {

  solutionsDataSource = new MatTableDataSource<Solution>();
  solutionsCols = ['deliveryTs', 'state', 'grade', 'actions'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input('solutions') set solutions(solutions: Solution[]) {
    if (solutions != null)
      this.solutionsDataSource.data = [...solutions];
  }

  constructor(public dialog: MatDialog) { }

  /**
   * Used to initialize sort and paginator once that the view is initilized.
   */
  ngAfterViewInit() {
    this.solutionsDataSource.sort = this.sort;
    this.solutionsDataSource.paginator = this.paginator;
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
   * Used to change the format of the selected date.
   * 
   * @param date that is printed.
   */
  formatDate(date: Date) {
    return moment(date).format('DD-MM-YYYY, HH:mm:ss');
  }
}
