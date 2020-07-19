import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { VM, VmService, TeamService, Team } from 'src/app/core';

@Component({
  selector: 'app-teacher-vms-cont',
  templateUrl: './teacher-vms-cont.component.html',
  styles: []
})
export class TeacherVmsContComponent implements OnInit {

  teams$: Observable<Team[]>;
  vms$: Observable<VM[]>
  courseName: string;
  errorMsg: string; 

  constructor(private route: ActivatedRoute, private vmService: VmService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseName = params['courseName'];
      this.getTeams();
    });
  }

  getTeams() {
    this.teams$ = this.teamService.getCourseTeams(this.courseName);
  }

  getVms(team: Team) {
    this.vms$ = this.vmService.getTeamVms(team.id);
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
