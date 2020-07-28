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

  @ViewChild('matSelect') select: MatSelect; 
  @ViewChild('stepper') stepper: MatStepper; 
  
  vm: VM;
  showAddDiv: Boolean = false;
  showAddButton: Boolean = true;
  showModelView: Boolean = false;
  _errorMsg: string = "";
  _modelVm: ModelVM = {} as ModelVM;
  _team: Team;
  _teamStudents: Student[];
  _vms: VM[];
  ram: number;
  vcpu: number;
  disk: number;

  constructor() { }

  @Input()
  set modelVm(modelVm: ModelVM) {
    if(modelVm != null) {
      this._modelVm = modelVm;
      this.showModelView = true;
    }
  }

  @Input()
  set vms(vms: VM[]){
    if(vms != null)
      this._vms = [...vms];
    else
      this._vms = [];
  }

  @Input()
  set errorMsg(error: string){
    this._errorMsg = error;
  }

  @Input()
  set team(team: Team){
    if(team != null) {
      this._team = team;
      this.showAddButton = true;
    } else {
      this.showAddButton = false;
    }
  }

  @Input()
  set teamStudents(students: Student[]){
    this._teamStudents = students;
  }

  @Output('add') add = new EventEmitter<VM>();
  @Output('modify') modify = new EventEmitter<VM>();
  @Output('delete') delete = new EventEmitter<number>();
  @Output('onOff') onOff = new EventEmitter<VM>();
  @Output('getStudents') getStudents = new EventEmitter<number>();


  /* It is used to show/close the stepper */
  addOpenStepper() {
    this.vm = {id: null, name: "", vcpu: 0, disk: 0, ram: 0, active: false, owners: []};
    this.open();
  }

  closeStepper() {
    this.showAddDiv = false;
    this._errorMsg = "";
  }

  modifyOpenStepper(vm: VM) {
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
    if(this.stepper !== undefined)
      this.stepper.reset();
  }


  /* Used to perform operation of buttons in view */
  confirmVm() {
    if(this.vm.id === null)
      this.add.emit(this.vm);
    else
      this.modify.emit(this.vm);
    this.showAddDiv = false;
  }

  onOffVm(vm: VM) {
    this.showAddDiv = false;
    this.onOff.emit(vm);
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
    this.select.value = "";
  }

  removeStudent(removedStudent: Student) {
    if(this.vm.owners.includes(removedStudent))
      this.vm.owners.splice(this.vm.owners.indexOf(removedStudent), 1);
  }
}
