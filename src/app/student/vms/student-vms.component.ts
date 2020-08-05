import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { VM } from '../../core/models/vm.model';
import { Team, Student, ModelVM } from '../../core';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-student-vms',
  templateUrl: './student-vms.component.html',
  styleUrls: ['./student-vms.component.css']
})
export class StudentVmsComponent {

  vm: VM;
  showAddDiv: Boolean = false;
  showAddButton: Boolean = true;
  showModelView: Boolean = false;
  _errorMsg: string = "";
  _modelVm: ModelVM = {} as ModelVM;
  _team: Team;
  _teamStudents: Student[];
  _vms: VM[];
  newOwners: Student[] = [];
  ram: number;
  vcpu: number;
  disk: number;

  @ViewChild('matSelect') select: MatSelect;
  @ViewChild('stepper') stepper: MatStepper;

  @Input()
  set modelVm(modelVm: ModelVM) {
    if (modelVm != null) {
      this._modelVm = modelVm;
      this.showModelView = true;
    }
  }

  @Input()
  set vms(vms: VM[]) {
    if (vms != null)
      this._vms = [...vms];
    else
      this._vms = [];
  }

  @Input()
  set errorMsg(error: string) {
    this._errorMsg = error;
  }

  @Input()
  set team(team: Team) {
    if (team != null) {
      this._team = team;
      this.showAddButton = true;
    } else {
      this.showAddButton = false;
    }
  }

  @Input()
  set teamStudents(students: Student[]) {
    if (students != null) {
      this.vm.id == null
        ? this._teamStudents = students.filter(student => student.serial != localStorage.getItem('serial'))
        : this._teamStudents = students.filter(student => !(this.vm.owners.filter(s1 => s1.serial == student.serial).length > 0));
    }
  }

  @Output('add') add = new EventEmitter<VM>();
  @Output('modify') modify = new EventEmitter<VM>();
  @Output('delete') delete = new EventEmitter<number>();
  @Output('onOff') onOff = new EventEmitter<VM>();
  @Output('getStudents') getStudents = new EventEmitter<number>();

  constructor() { }

  addOpenStepper() {
    this.vm = { id: null, name: "", vcpu: 0, disk: 0, ram: 0, active: false, owners: [] };
    this.open();
  }

  closeStepper() {
    this.showAddDiv = false;
    this.newOwners = [];
  }

  modifyOpenStepper(vm: VM) {
    this.vm = { id: vm.id, name: vm.name, vcpu: vm.vcpu, disk: vm.disk, ram: vm.ram, owners: vm.owners };
    this.open();
  }

  open() {
    this.ram = this._team.ram;
    this.vcpu = this._team.vcpu;
    this.disk = this._team.disk;
    this._vms.forEach(vm => {
      if (this.vm.id !== vm.id) {
        this.ram -= vm.ram;
        this.vcpu -= vm.vcpu;
        this.disk -= vm.disk;
      }
    });
    this.getStudents.emit(this._team.id);
    this.showAddDiv = true;
    if (this.stepper !== undefined)
      this.stepper.reset();
  }

  confirmVm() {
    this.vm.owners = this.newOwners;
    this.vm.id === null
    ? this.add.emit(this.vm)
    : this.modify.emit(this.vm);
    this.showAddDiv = false;
    this.newOwners = [];
  }

  onOffVm(vm: VM) {
    this.showAddDiv = false;
    this.onOff.emit(vm);
  }

  deleteVm(vmId: number) {
    this.showAddDiv = false;
    this.delete.emit(vmId);
  }

  addStudent(event: MatSelectChange) {
    if (!this.newOwners.includes(event.value))
      this.newOwners.push(event.value);
    this.select.value = "";
  }

  removeStudent(removedStudent: Student) {
    if (this.newOwners.includes(removedStudent))
      this.newOwners.splice(this.vm.owners.indexOf(removedStudent), 1);
  }
}
