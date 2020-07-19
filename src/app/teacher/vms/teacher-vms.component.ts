import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { VM, Team } from 'src/app/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-teacher-vms',
  templateUrl: './teacher-vms.component.html',
  styleUrls: ['./teacher-vms.component.css']
})
export class TeacherVmsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'students', 'actions'];
  dataSource: MatTableDataSource<Team> = new MatTableDataSource<Team>();

  @ViewChild(MatSort, {static: true}) sort: MatSort; 
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  showModifyDiv: Boolean = false;
  showResourcesDiv: Boolean = false;
  showVms: Boolean = false;
  modifiedTeam: Team;
  actualTeam: Team;
  resourcesTeam: Team;
  _errorMsg: string;
  _vms: VM[];
  teamSelection: SelectionModel<Team>;

  constructor() { }

  @Input()
  set teams(teams: Team[]){
    if(teams != null)
      this.dataSource.data = [...teams];
    else
      this.dataSource.data = [];
  }

  @Input()
  set vms(vms: VM[]){
    if(vms != null)
      this._vms = [...vms];
    else
      this._vms = [];
    this.computeResources();
  }

  @Input()
  set errorMsg(error: string){
    this._errorMsg = error;
    if(this._errorMsg === "") {
      this.closeDiv();
      //this.showVms = false;
    }
  }

  @Output() modify = new EventEmitter<Team>();
  @Output() team = new EventEmitter<Team>();
  @Output() onOff = new EventEmitter<{id: number, team: Team}>();

  ngOnInit(): void {
    this.teamSelection = new SelectionModel<Team>(false, []);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }



  modifyTeam(team: Team) {
    this._errorMsg = "";
    this.modifiedTeam = team;
    this.showModifyDiv = true;
    this.showVms = false;
  }
  
  computeResources() {
    this._vms.forEach(vm => {
      if(vm.active) {
        this.resourcesTeam.ram += vm.ram;
        this.resourcesTeam.disk += vm.disk;
        this.resourcesTeam.vcpu += vm.vcpu;
        this.resourcesTeam.activeInstance += 1;
      }
    })
  }

  closeDiv() {
    this.showModifyDiv = false;
  }

  confirmTeam() {
    this.modify.emit(this.modifiedTeam);
  }


  teamSelected(team: Team) {
    this.teamSelection.toggle(team);
    if(this.teamSelection.hasValue()) {
      this.actualTeam = team;
      this.modifiedTeam = team;
      this.team.emit(team);
      this.showVms = true;
      this.showResourcesDiv = true;
    } else {
      this.showVms = false;
      this.showResourcesDiv = false;
    }
    this.resourcesTeam = {name: "", ram: 0, disk: 0, vcpu: 0, activeInstance: 0};
  }


  onOffVm(vmId: number) {
    // The content dialog must be shown
    this.onOff.emit({id: vmId, team: this.actualTeam});
    this.resourcesTeam = {name: "", ram: 0, disk: 0, vcpu: 0, activeInstance: 0};
  }
}
