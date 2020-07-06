import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { VM } from '../core/models/vm.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort'; 
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vms',
  templateUrl: './vms.component.html',
  styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit, AfterViewInit {

  ram = 0;
  vcpu = 0;
  disk = 0;
  constructor() { }

  @ViewChild(MatSort, {static: true}) sort: MatSort; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  displayedColumns: string[] = ['select', 'name', 'student', 'state', 'action'];
  
  dataSource: MatTableDataSource<VM> = new MatTableDataSource<VM>();
  private _vms: VM[];

  @Output() add = new EventEmitter<VM[]>();
  @Output() delete = new EventEmitter<VM[]>();
  
  selectedVm: VM[] = []; //used to add
  selectedVms: SelectionModel<VM>;  //used to delete

  showAddDiv: Boolean = false;

  showAdd() {
    this.showAddDiv = this.showAddDiv ? false : true;
  }

  
  @Input() 
  set vms(vms: VM[]){
    this._vms = vms;
  }

  ngOnInit() {
    console.log("ngOnInit called");
    this.selectedVms = new SelectionModel<VM>(true, []);
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit called");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

 
  // CheckBox functions
  isAllSelected() {
    const numSelected = this.selectedVms.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selectedVms.clear() :
      this.dataSource.data.forEach(row => this.selectedVms.select(row));
  }

  isChanged(row: VM){
    console.log("students.isChanged");
    this.selectedVms.toggle(row)
  }

  
  
  /* // insert and delete student
  addStudent(){
    console.log("students.addStudent");
    
    if(this.selectedStudent != null && this.dataSource.data.filter(s => s.id == this.selectedStudent[0].id).length == 0) {
      this.add.emit(this.selectedStudent);
    }
    this.selectedStudent = [];
    this.search.value = '';
    this.filteredStudents = this._students;
  }

  deleteSelected(){
    console.log("students.deleteSelected");
    
    if(!(this.selectedStudents.selected.length == 0))
      this.delete.emit(this.selectedStudents.selected);

    this.selectedStudents = new SelectionModel<Student>(true, []);
  } */


}
