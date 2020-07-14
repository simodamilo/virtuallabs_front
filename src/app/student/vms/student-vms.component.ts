import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VM } from '../../core/models/vm.model';
import { MatDialog } from '@angular/material/dialog';
import { Team, Student } from '../../core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-student-vms',
  templateUrl: './student-vms.component.html',
  styleUrls: ['./student-vms.component.css']
})
export class StudentVmsComponent {
  
  /* Used for vms-table */
  _vms: VM[];

  vm: VM;
  showAddDiv: Boolean = false;
  _errorMsg: string = "";
  _team: Team;
  _teamStudents: Student[];
  ram: number;
  vcpu: number;
  disk: number;

  constructor(public dialog: MatDialog) { }

  @Input()
  set vms(vms: VM[]){
    if(vms != null) {
      this._vms = [...vms];
      if(this._errorMsg === "")
        this.showAddDiv = false;
    }
  }

  @Input()
  set errorMsg(error: string){
      this._errorMsg = error;
  }

  @Input()
  set team(team: Team){
    if(team != null) {
      this._team = team;
    }
  }

  @Input()
  set teamStudents(students: Student[]){
    this._teamStudents = students;
  }

  @Output() add = new EventEmitter<VM>();
  @Output() modify = new EventEmitter<VM>();
  @Output() delete = new EventEmitter<number>();
  @Output() onOff = new EventEmitter<number>();
  @Output() getStudents = new EventEmitter<number>();


  /* It is used to show/close the stepper */
  openStepper() {
    this.vm = {id: null, name: "", vcpu: 0, disk: 0, ram: 0, active: false, owners: []};
    this.open();
  }

  closeStepper() {
    this.showAddDiv = false;
  }

  modifyVm(vm: VM) {
    this.vm = {id: vm.id, name: vm.name, vcpu: vm.vcpu, disk: vm.disk, ram: vm.ram, owners: []};
    this.open();
  }

  open() {
    this.ram = this._team.ram;
    this.vcpu = this._team.vcpu;
    this.disk = this._team.disk;
    this._vms.forEach(vm => {
      if(this.vm.id !== vm.id) {
        this.ram -= vm.ram;
        this.vcpu -= vm.vcpu;
        this.disk -= vm.disk;
      }
    });
    this._errorMsg = "";
    this.getStudents.emit(this._team.id);
    this.showAddDiv = true;
  }

  /* Used to perform operation of buttons in view */
  confirmVm() {
    this._errorMsg = "";
    if(this.vm.id === null)
      this.add.emit(this.vm);
    else
      this.modify.emit(this.vm);
  }

  onOffVm(vmId: number) {
    this.showAddDiv = false;
    this.onOff.emit(vmId);
  }

  deleteVm(vmId: number) {
    console.log("vms");
    this.showAddDiv = false;
    this.delete.emit(vmId);
  }

  /* Used to manage the list of new owners */
  addStudent(event: MatSelectChange) {
    if(!this.vm.owners.includes(event.value))
      this.vm.owners.push(event.value);
  }

  removeStudent(removedStudent: Student) {
    if(this.vm.owners.includes(removedStudent))
      this.vm.owners.splice(this.vm.owners.indexOf(removedStudent), 1);
  }

}
