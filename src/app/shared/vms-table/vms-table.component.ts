import { Component, AfterViewInit, Input, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { VM } from '../../core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vms-table',
  templateUrl: './vms-table.component.html',
  styleUrls: ['./vms-table.component.css']
})
export class VmsTableComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['name', 'student', 'state', 'actions'];
  dataSource: MatTableDataSource<VM> = new MatTableDataSource<VM>();
  isStudent: Boolean = true;

  @ViewChild(MatSort, {static: true}) sort: MatSort; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Output() modify = new EventEmitter<VM>();
  @Output() delete = new EventEmitter<number>();
  @Output() onOff = new EventEmitter<VM>();

  constructor() { }

  ngOnInit() {
    if(localStorage.getItem("role") === "student")
      this.isStudent = true;
    else
      this.isStudent = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  @Input()
  set vms(vms: VM[]){ 
    if(vms != null) {
      vms.sort(function(a, b) { //TODO fare con matSort?
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB)
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
      });
      this.dataSource.data = [...vms];
    }
  }


  modifyVm(vm: VM) {
    this.modify.emit(vm);
  }

  onOffVm(vm: VM) {
    this.onOff.emit(vm);
  }

  deleteVm(vmId: number) {
    console.log("vms");
    this.delete.emit(vmId);
  }


  isOwner(vm: VM) {
    return vm.owners.some(owner => owner.serial === localStorage.getItem("serial"));
  }
}
