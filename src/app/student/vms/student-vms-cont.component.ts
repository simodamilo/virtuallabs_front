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
    model => {
      this.modelVm = model
    }, 
    err => {
      this.errorMsg = "No model available, it is not possible to add a new Virtual Machine";
    })
  }

  getVms() {
    this.teamService.getStudentTeamByCourse(this.courseName).subscribe(
      team => {
        this.team = team;
        this.vms$ = this.vmService.getTeamVms(team.id);
      },
      () => {
        this.team = null;
        this.errorMsg = "No team available, you must be part of a team to add a new virtual machine"
      }
    );
  }

  addVm(vm: VM) {
    this.errorMsg = "";
    this.vmService.addVmService(vm, this.team.id).subscribe(
      res => {
        this.vmService.addOwner(vm.owners, res.id).subscribe(
          vms => {
            this.errorMsg = "";
          }, 
          err => {
            this.errorMsg = "It is not possible to add all students as owners, but a new virtual machine is created";
          }
        )
        this.getVms();
      },
      err => {
        this.errorMsg = "It is not possible to add the virtual machine";
      }
    );
  }

  onOffVm(vm: VM) {
    this.errorMsg = "";
    this.vmService.onOffVm(vm.id).subscribe(
      vm => {
        this.getVms();
        if(vm.active) {
          const dialogRef = this.dialog.open(ContentDialogComponent, {
            width: '70%',
            height: '80%',
            panelClass: 'custom-dialog-panel',
            data: {vm: vm, courseName: this.courseName}
          });

          //devo mettere la close per farlo spegnere in automatico o deve premere lo studente?
        }
      },
      err => {
        this.errorMsg = "It is not possible to turn on the Virtual Machine"
      }
    );
  }

  modifyVm(vm: VM) {
    this.errorMsg = "";
    this.vmService.modifyVm(vm).subscribe(
      res => {
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
        this.errorMsg = "You cannot modify this virtual machine";
      }
    );
  }

  deleteVm(vmId: number) {
    this.errorMsg = "";
    this.vmService.deleteVm(vmId).subscribe(
      () => {
        this.getVms();
      }, 
      err => {
        this.errorMsg = "It is not possible to delete this virtual machine";
      }
    );
  }

  getTeamStudents(teamId: number) {
    this.teamStudents$ = this.studentService.getTeamStudents(teamId);
  }

}
