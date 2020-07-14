import { Component, OnInit } from '@angular/core';
import { VmService, VM, TeamService, Team, StudentService, Student } from '../../core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vms-cont',
  templateUrl: './vms-cont.component.html',
  styleUrls: ['./vms-cont.component.css']
})
export class VmsContComponent implements OnInit {

  vms$: Observable<VM[]>;
  teamStudents$: Observable<Student[]>;
  errorMsg: string;
  team: Team;
  courseName: string;

  constructor(private vmService: VmService, private teamService: TeamService, private studentService: StudentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseName = params['courseName'];
      this.getVms();
    });
  }

  getVms() {
    this.teamService.getStudentTeamByCourse(this.courseName).subscribe(team => {
      this.team = team;
      this.vms$ = this.vmService.getTeamVms(this.team.id);
    });
  }

  addVm(vm: VM) {
    this.vmService.addVmService(vm, this.team.id).subscribe(
      res => {
        this.vmService.addOwner(vm.owners, res.id).subscribe(
          vms => {
            this.errorMsg = "";
          }, 
          err => {
            this.errorMsg = "It is not possible to add all students, but a new virtual machine is created";
          }
        )
        this.getVms();
      },
      err => {
        this.errorMsg = "It is not possible to add the vm";
      }
    );

    /* this.vmService.addVmService(vm, this.team.id).subscribe( 
    vms => {
      this.errorMsg = "";
    },
    err => {
      this.errorMsg = "It is not possible to add all students, but a new virtual machine is created";
    })
    this.getVms(); */
  }

  onOffVm(vmId: number) {
    this.vmService.onOffVm(vmId).subscribe(
      vm => {
        this.getVms();
      },
      err => {
        // Non si può accendere la macchina virtuale, dove visualizzare l'errore?
      }
    );
  }

  modifyVm(vm: VM) {
    this.vmService.modifyVm(vm).subscribe(
      res => {
        this.errorMsg = "";
        this.vmService.addOwner(vm.owners, res.id).subscribe(
          vms => {
            this.errorMsg = "";
          }, 
          err => {
            this.errorMsg = "It is not possible to add all students, they could be already owners of the vm";
          }
        )
        this.getVms();
      },
      err => {
        this.errorMsg = "Superato il limite";
      }
    );
  }

  deleteVm(vmId: number) {
    this.vmService.deleteVm(vmId).subscribe(() => {
      this.getVms();
    });
  }

  getTeamStudents(teamId: number) {
    this.teamStudents$ = this.studentService.getTeamStudents(teamId);
  }

}
