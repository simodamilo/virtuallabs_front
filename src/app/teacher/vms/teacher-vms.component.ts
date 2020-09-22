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
  modelVmForm: FormGroup;
  showModifyDiv: Boolean = false;
  showVms: Boolean = false;
  showModelForm: Boolean = false;
  showModelDiv: Boolean = false;
  modifiedTeam: Team;
  actualTeam: Team;
  resourcesTeam: Team;
  fileName: string = "";
  teamSelection: SelectionModel<Team>;
  _modelVm: ModelVM = {} as ModelVM;
  _vms: VM[];
  _modelVmErrorMsg: string = "";
  _teamsErrorMsg: string = "";

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('modelInput') input: ElementRef;

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
    teams !== null ? this.dataSource.data = [...teams] : this.dataSource.data = [];
    this.showVms = false;
    this.showModifyDiv = false;
  }

  @Input('vms')
  set vms(vms: VM[]) {
    this.resourcesTeam = { name: "", ram: 0, disk: 0, vcpu: 0, activeInstance: 0 };
    vms != null ? this._vms = [...vms] : this._vms = [];
    this.computeResources();
  }

  @Input('modelVmErrorMsg')
  set modelVmErrorMsg(error: string) {
    this._modelVmErrorMsg = error;
  }

  @Input('teamsErrorMsg')
  set teamsErrorMsg(error: string) {
    this._teamsErrorMsg = error;
  }

  @Output('team') team = new EventEmitter<Team>();
  @Output('modify') modify = new EventEmitter<Team>();
  @Output('delete') delete = new EventEmitter<number>();
  @Output('onOff') onOff = new EventEmitter<{ vm: VM, team: Team }>();
  @Output('addModelVm') addModel = new EventEmitter<ModelVM>();
  @Output('deleteModelVm') deleteModel = new EventEmitter<ModelVM>();

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.modelVmForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.teamSelection = new SelectionModel<Team>(false, []);
  }

  /**
   * Used to initialize sort and paginator once that the view is initilized.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Used to compute the minimum resourses that must be assigned to the selected team.
   */
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

  /**
   * Used to get the image of the modelVm when it is added.
   * 
   * @param file that contains the image.
   */
  onModelVmSelected(file: File) {
    this._modelVm.content = file
    this.modelVmErrorMsg = "";
    this.fileName = (file ? file.name : "");
  }

  /**
   * Used to add a modelVm.
   * 
   * @param name of the modelVm.
   * @param type of the modelVm.
   */
  addModelVm(name: string, type: string) {
    if (this.modelVmForm.valid && this._modelVm.content != null) {
      this._modelVm.name = name;
      this._modelVm.type = type;
      this.addModel.emit(this._modelVm);
      this.input.nativeElement.value = "";
      this.fileName = "";
    } else {
      this.modelVmErrorMsg = "Complete every field";
    }
  }

  /**
   * Used to open the ContentDialog to display the modelVm image.
   */
  viewModelVm() {
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '70%',
      height: '80%',
      panelClass: 'custom-dialog-panel',
      data: { modelVm: this._modelVm }
    });
  }

  /**
   * Used to delete a modelVm.
   */
  deleteModelVm() {
    this.deleteModel.emit(this._modelVm);
  }

  /**
   * Used to modify the selected team.
   */
  confirmTeam() {
    this.modify.emit(this.modifiedTeam);
  }

  /**
   * Used to show the div the a team can be modfied.
   * 
   * @param team that is selected to be modified.
   */
  modifyTeam(team: Team) {
    this._teamsErrorMsg = "";
    this.modifiedTeam = {
      name: team.name,
      id: team.id,
      vcpu: team.vcpu,
      disk: team.disk,
      ram: team.ram,
      activeInstance: team.activeInstance,
      maxInstance: team.maxInstance
    };

    this.showModifyDiv = true;
    if (this.stepper !== undefined)
      this.stepper.reset();
  }

  /**
   * 
   * @param team that is selected to be deleted.
   */
  deleteTeam(team: Team) {
    this._teamsErrorMsg = "";
    this.delete.emit(team.id);
  }

  /**
   * Used to select a team to show its vms.
   * 
   * @param team selected.
   */
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
  }

  /**
   * Used to turn on the selected vm. 
   * 
   * @param vm that is turned on.
   */
  onOffVm(vm: VM) {
    this.onOff.emit({ vm: vm, team: this.actualTeam });
  }

  getErrorNameMessage() {
    if (this.modelVmForm.get('name').hasError('required'))
      return 'You must enter a value';
  }

  getErrorTypeMessage() {
    if (this.modelVmForm.get('type').hasError('required'))
      return 'You must enter a value';
  }

}
