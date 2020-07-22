import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { VM, VmService, TeamService, Team, ModelVM, ModelVmService } from 'src/app/core';

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

  constructor(private route: ActivatedRoute, private vmService: VmService, private teamService: TeamService, private modelVmService: ModelVmService) { }

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
      () => {
        
      }
    );
  }

  deleteModelVm(event) {
    this.modelVmService.deleteModelVm(event.id).subscribe(
      () => {
        this.getModelVm();
      }
    );
  }

  modifyTeam(team: Team) {
    this.teamService.modifyTeam(team).subscribe(
      team => {
        this.errorMsg = "";
        this.getTeams();
      },
      err => {
        this.errorMsg = "It is not possible to modify team constraints";
      }
    );
  }

  onOffVm(event) {
    this.errorMsg = "";
    this.vmService.onOffVm(event.id).subscribe(
      vm => {
        this.getVms(event.team);
      },
      err => {
        this.errorMsg = "It is not possible to turn on the Virtual Machine"
      }
    );
  }

}
