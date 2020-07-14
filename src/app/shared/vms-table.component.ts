import { Component, AfterViewInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { VM } from '../core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vms-table',
  templateUrl: './vms-table.component.html',
  styleUrls: ['./vms-table.component.css']
})
export class VmsTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'student', 'state', 'actions'];
  dataSource: MatTableDataSource<VM> = new MatTableDataSource<VM>();

  @ViewChild(MatSort, {static: true}) sort: MatSort; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Output() modify = new EventEmitter<VM>();
  @Output() delete = new EventEmitter<number>();
  @Output() onOff = new EventEmitter<number>();

  constructor() { }

  ngAfterViewInit() {
    console.log("ngAfterViewInit called");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  @Input()
  set vms(vms: VM[]){
    if(vms != null) {
      this.dataSource.data = [...vms];
    }
  }


  modifyVm(vm: VM) {
    this.modify.emit(vm);
  }

  onOffVm(vmId: number) {
    this.onOff.emit(vmId);
  }

  deleteVm(vmId: number) {
    console.log("vms");
    this.delete.emit(vmId);
  }

}
