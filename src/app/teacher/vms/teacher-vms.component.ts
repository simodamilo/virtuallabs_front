import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { VM, Team, ModelVM } from 'src/app/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContentDialogComponent } from 'src/app/shared/content-dialog/content-dialog.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-teacher-vms',
  templateUrl: './teacher-vms.component.html',
  styleUrls: ['./teacher-vms.component.css']
})
export class TeacherVmsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'students', 'actions'];
  dataSource: MatTableDataSource<Team> = new MatTableDataSource<Team>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('modelInput') input: ElementRef;

  modelVmForm: FormGroup;
  showModifyDiv: Boolean = false;
  showVms: Boolean = false;
  showModelForm: Boolean = false;
  showModelDiv: Boolean = false;
  modifiedTeam: Team;
  actualTeam: Team;
  resourcesTeam: Team;
  _modelVm: ModelVM = {} as ModelVM;
  _errorMsg: string;
  _vms: VM[];
  fileName: string = "";
  teamSelection: SelectionModel<Team>;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.modelVmForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  @Input('modelVm')
  set modelVm(modelVm: ModelVM) {
    if (modelVm !== null) {
      this._modelVm = modelVm;
      this.showModelForm = false;
      this.showModelDiv = true;
      this.modelVmForm.reset();
      Object.keys(this.modelVmForm.controls).forEach(key => {
        this.modelVmForm.get(key).setErrors(null);
      });
    } else {
      this.showModelForm = true;
      this.showModelDiv = false;
    }
  }

  @Input('teams')
  set teams(teams: Team[]) {
    if (teams !== null)
      this.dataSource.data = [...teams];
    else
      this.dataSource.data = [];

    this.showVms = false;
    this.closeDiv();
  }

  @Input('vms')
  set vms(vms: VM[]) {
    if (vms != null)
      this._vms = [...vms];
    else
      this._vms = [];
    this.computeResources();
  }

  @Input('errorMsg')
  set errorMsg(error: string) {
    this._errorMsg = error;
  }

  @Output('modify') modify = new EventEmitter<Team>();
  @Output('team') team = new EventEmitter<Team>();
  @Output('onOff') onOff = new EventEmitter<{ vm: VM, team: Team }>();
  @Output('addModelVm') addModel = new EventEmitter<ModelVM>();
  @Output('deleteModelVm') deleteModel = new EventEmitter<ModelVM>();

  ngOnInit(): void {
    this.teamSelection = new SelectionModel<Team>(false, []);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  /* Error functions */
  getErrorNameMessage() {
    if (this.modelVmForm.get('name').hasError('required'))
      return 'You must enter a value';
  }

  getErrorTypeMessage() {
    if (this.modelVmForm.get('type').hasError('required'))
      return 'You must enter a value';
  }

  /* Used to compute real time resources */
  computeResources() {
    this._vms.forEach(vm => {
      if (vm.active) {
        this.resourcesTeam.ram += vm.ram;
        this.resourcesTeam.disk += vm.disk;
        this.resourcesTeam.vcpu += vm.vcpu;
        this.resourcesTeam.activeInstance += 1;
      }
    })
  }



  /* Used to add an image to the modelVm */
  onModelVmSelected(event) {
    this._modelVm.content = event.target.files[0]
    this.fileName = event.target.files[0] ? event.target.files[0].name : "";
  }

  /* Button used to add the modelVm */
  addModelVm(name: string, type: string) {
    if (this.modelVmForm.get('name').valid && this.modelVmForm.get('type').valid) {
      this._modelVm.name = name;
      this._modelVm.type = type;
      this.addModel.emit(this._modelVm);
      this.input.nativeElement.value = "";
      this.fileName = "";
    }
  }

  /* Used to open the content dialog for modelVm image */
  viewModelVm() {
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
      data: { modelVm: this._modelVm }
    });
  }

  /* Used to delete the modelVm */
  deleteModelVm() {
    this.deleteModel.emit(this._modelVm);
  }


  /* Edit button in team table */
  modifyTeam(team: Team) {
    this._errorMsg = "";
    this.modifiedTeam = team;
    this.showModifyDiv = true;
    if (this.stepper !== undefined)
      this.stepper.reset();
  }

  /* Close button in modify div */
  closeDiv() {
    this.showModifyDiv = false;
  }

  /* Confirm button in modify div */
  confirmTeam() {
    this.modify.emit(this.modifiedTeam);
  }

  /* Called when the user tap on one row */
  teamSelected(team: Team) {
    this.teamSelection.toggle(team);
    if (this.teamSelection.hasValue()) {
      this.actualTeam = team;
      this.modifiedTeam = team;
      this.team.emit(team);
      this.showVms = true;
    } else {
      this.showVms = false;
    }
    this.resourcesTeam = { name: "", ram: 0, disk: 0, vcpu: 0, activeInstance: 0 };
  }


  /* Turn on/off button in vms table */
  onOffVm(vm: VM) {
    this.onOff.emit({ vm: vm, team: this.actualTeam });
    this.resourcesTeam = { name: "", ram: 0, disk: 0, vcpu: 0, activeInstance: 0 };
  }

}
