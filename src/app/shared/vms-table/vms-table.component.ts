import { Component, AfterViewInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { VM } from '../../core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vms-table',
  templateUrl: './vms-table.component.html',
  styles: ['.student-column { padding-left: 16px; }']
})
export class VmsTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'student', 'state', 'actions'];
  dataSource: MatTableDataSource<VM> = new MatTableDataSource<VM>();
  isStudent: Boolean = true;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input('vms')
  set vms(vms: VM[]) {
    if (vms != null) {
      this.dataSource.data = [...vms];
    }
  }

  @Output() modify = new EventEmitter<VM>();
  @Output() delete = new EventEmitter<number>();
  @Output() onOff = new EventEmitter<VM>();

  constructor() {
    localStorage.getItem("role") === "student" 
    ? this.isStudent = true
    : this.isStudent = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Used to pass the selected vm to the component that use the table.
   * 
   * @param vm that can be modifed.
   */
  modifyVm(vm: VM) {
    this.modify.emit(vm);
  }

  /**
   * Used to pass the selected vm to the component that use the table.
   * 
   * @param vm that is turned on.
   */
  onOffVm(vm: VM) {
    this.onOff.emit(vm);
  }

  /**
   * Used to pass the selected vm id to the component that use the table.
   * 
   * @param vmId of the vm that is deleted.
   */
  deleteVm(vmId: number) {
    this.delete.emit(vmId);
  }

  /**
   * USed to check if the current user is owner of the vm.
   * 
   * @param vm of which the check is performed.
   */
  isOwner(vm: VM) {
    return vm.owners.some(owner => owner.serial === localStorage.getItem("serial"));
  }
}
