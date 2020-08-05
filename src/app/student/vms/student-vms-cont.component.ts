import { Component, OnInit } from '@angular/core';
import { VmService, VM, TeamService, Team, StudentService, Student, ModelVmService, ModelVM } from '../../core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContentDialogComponent } from 'src/app/shared/content-dialog/content-dialog.component';

@Component({
  selector: 'app-student-vms-cont',
  templateUrl: './student-vms-cont.component.html',
  styles: []
})
export class StudentVmsContComponent implements OnInit {

  vms$: Observable<VM[]>;
  teamStudents$: Observable<Student[]>;
  errorMsg: string;
  team: Team;
  modelVm: ModelVM;
  courseName: string;

  constructor(private vmService: VmService,
    private modelVmService: ModelVmService,
    private teamService: TeamService,
    private studentService: StudentService,
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseName = params['courseName'];
      this.getModelVm();
      this.getVms();
    });
  }

  getModelVm() {
    this.modelVmService.getModelVm(this.courseName).subscribe(
      (model) => this.modelVm = model,
      (err) => this.errorMsg = err.error.message
    )
  }

  getVms() {
    this.teamService.getStudentTeamByCourse(this.courseName).subscribe(
      (team) => {
        this.team = team;
        this.vms$ = this.vmService.getTeamVms(team.id);
      },
      (err) => {
        this.team = null;
        this.errorMsg = err.error.message;
      }
    );
  }

  addVm(vm: VM) {
    this.errorMsg = "";
    this.vmService.addVm(vm, this.team.id).subscribe(
      () => this.vms$ = this.vmService.getTeamVms(this.team.id),
      (err) => this.errorMsg = err.error.message
    );
  }

  modifyVm(vm: VM) {
    this.errorMsg = "";
    this.vmService.modifyVm(vm).subscribe(
      () => this.getVms(),
      (err) => this.errorMsg = err.error.message
    );
  }

  onOffVm(vm: VM) {
    this.errorMsg = "";
    this.vmService.onOffVm(vm.id).subscribe(
      (vm) => {
        this.getVms();
        if (vm.active) {
          const dialogRef = this.dialog.open(ContentDialogComponent, {
            width: '70%',
            height: '80%',
            panelClass: 'custom-dialog-panel',
            data: { vm: vm, courseName: this.courseName }
          });

          dialogRef.afterClosed().subscribe(
            () => this.vmService.onOffVm(vm.id).subscribe(vm => this.getVms())
          );
        }
      },
      (err) => this.errorMsg = err.error.message
    );
  }

  deleteVm(vmId: number) {
    this.errorMsg = "";
    this.vmService.deleteVm(vmId).subscribe(
      () => this.getVms(),
      (err) => this.errorMsg = err.error.message
    );
  }

  getTeamStudents(teamId: number) {
    this.errorMsg = "";
    this.teamStudents$ = this.studentService.getTeamStudents(teamId);
  }
}
