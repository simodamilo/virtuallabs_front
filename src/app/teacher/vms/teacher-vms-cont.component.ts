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

  /**
   * Used to initialize some values when the component starts.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseName = params['courseName'];
      this.teams$ = this.teamService.getCourseTeams(this.courseName);
      this.modelVm$ = this.modelVmService.getModelVm(this.courseName);
    });
  }

  /**
   * Used to get the vms of a team.
   * 
   * @param team of which vms are taken.
   */
  getVms(team: Team) {
    this.vms$ = this.vmService.getTeamVms(team.id);
  }

  /**
   * Used to add a modelVm.
   * 
   * @param event is the modelVm that is added.
   */
  addModelVm(event) {
    this.modelVmService.addModelVm(event, this.courseName).subscribe(
      (modelVm) => {
        console.log(modelVm)
        this.modelVm$ = of(modelVm);
      },
      (err) => {
        this.errorMsg = err.error.message;
      }
    );
  }

  /**
   * Used to delete a modelVm.
   * 
   * @param event is the modelVm that is deleted.
   */
  deleteModelVm(event) {
    this.modelVmService.deleteModelVm(event.id).subscribe(
      () => this.modelVm$ = this.modelVmService.getModelVm(this.courseName),
      (err) => this.errorMsg = err.error.message
    );
  }

  /**
   * Used to modify a modelVm.
   * 
   * @param event is the modelVm that is modified.
   */
  modifyTeam(team: Team) {
    this.errorMsg = "";
    this.teamService.setTeamParams(team).subscribe(
      () => this.teams$ = this.teamService.getCourseTeams(this.courseName),
      (err) => this.errorMsg = err.error.message
    );
  }

  /**
   * 
   * @param teamId 
   */
  deleteTeam(teamId: number){
    this.teamService.deleteTeam(teamId).subscribe(
      ()=> this.teams$ = this.teamService.getCourseTeams(this.courseName),
      (err) => this.errorMsg = err.error.message
    )
  }

  /**
   * Used to turn on the passed vm, it opens a dialog with the image of the vm.
   * 
   * @param event contains the vm that is turned on and the corresponding team.
   */
  onOffVm(event) {
    this.errorMsg = "";
    this.vmService.onOffVm(event.vm.id).subscribe(
      (vm) => {
        this.getVms(event.team);
        if (vm.active) {
          const dialogRef = this.dialog.open(ContentDialogComponent, {
            width: '70%',
            height: '80%',
            panelClass: 'custom-dialog-panel',
            data: { vm: vm, courseName: this.courseName }
          });

          dialogRef.afterClosed().subscribe(
            () => this.vmService.onOffVm(event.vm.id).subscribe(() => this.getVms(event.team))
          );
        }
      },
      (err) => this.errorMsg = err.error.message
    );
  }

}
