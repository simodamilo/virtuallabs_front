import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from 'src/app/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.css']
})
export class StudentsTableComponent implements OnInit, AfterViewInit {
  
  dataSource: MatTableDataSource<Student> = new MatTableDataSource();
  colsToDisplay = ['select', 'id', 'name', 'surname'];
  selection: SelectionModel<Student>;
  isStudent: Boolean = true;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input()
  set students(students: Student[]) {
    if(students != null) {
      this.dataSource.data = [...students]; // da errore ma non capisco perchè
      this.selection.clear();
    }
  }

  @Output('selectedStudents') selectedStudentsEmitter = new EventEmitter<Student[]>();

  constructor() {
    this.selection = new SelectionModel<Student>(true, []);
  }

  ngOnInit() {
    if(localStorage.getItem("role") === "student") {
      this.isStudent = true;
      this.colsToDisplay = ['select', 'serial', 'name', 'surname'];
    } else {
      this.isStudent = false;
      this.colsToDisplay = ['select', 'serial', 'name', 'surname', 'group'];
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /* Checkbox functions */
  toggleRowsTable(event: MatCheckboxChange, row: Student) {
    this.selection.toggle(row);
    this.selectedStudentsEmitter.emit(this.selection.selected);
  }

  toggleMasterTable() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    
    this.selectedStudentsEmitter.emit(this.selection.selected);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

}
