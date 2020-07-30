import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { VM, VmService, TeamService, Team, ModelVM, ModelVmService } from 'src/app/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentDialogComponent } from 'src/app/shared/content-dialog/content-dialog.component';

@Component({
  selector: 'app-teacher-vms-cont',
  templateUrl: './teacher-vms-cont.component.html',
  styles: []
})
export class TeacherVmsContComponent implements OnInit {

  teams$: Observable<Team[]>;
  modelVm$: Observable<ModelVM>;
  vms$: Observable<VM[]>
  courseName: string;
  errorMsg: string;

  constructor(private route: ActivatedRoute,
    private vmService: VmService,
    private teamService: TeamService,
    private modelVmService: ModelVmService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseName = params['courseName'];
      this.getTeams();
      this.getModelVm();
    });
  }

  getModelVm() {
    this.modelVm$ = this.modelVmService.getModelVm(this.courseName);
  }

  getTeams() {
    this.teams$ = this.teamService.getCourseTeams(this.courseName);
  }

  getVms(team: Team) {
    this.vms$ = this.vmService.getTeamVms(team.id);
  }

  addModelVm(event) {
    this.modelVmService.addModelVm(event, this.courseName).subscribe(
      modelVm => {
        console.log(modelVm)
        this.modelVm$ = of(modelVm);
      },
      err => {
        this.errorMsg = err.error.message;
      }
    );
  }

  deleteModelVm(event) {
    this.modelVmService.deleteModelVm(event.id).subscribe(
      () => {
        this.getModelVm();
      },
      err => {
        this.errorMsg = err.error.message;
      }
    );
  }

  modifyTeam(team: Team) {
    this.teamService.modifyTeam(team).subscribe(
      () => {
        this.errorMsg = "";
        this.getTeams();
      },
      err => {
        this.errorMsg = err.error.message;
      }
    );
  }

  onOffVm(event) {
    this.errorMsg = "";
    this.vmService.onOffVm(event.vm.id).subscribe(
      vm => {
        this.getVms(event.team);
        if (vm.active) {
          const dialogRef = this.dialog.open(ContentDialogComponent, {
            width: '70%',
            height: '80%',
            panelClass: 'custom-dialog-panel',
            data: { vm: vm, courseName: this.courseName }
          });

          dialogRef.afterClosed().subscribe(
            () => this.vmService.onOffVm(event.vm.id).subscribe(vm => this.getVms(event.team))
          );
        }
      },
      err => {
        this.errorMsg = err.error.message;
      }
    );
  }

}
