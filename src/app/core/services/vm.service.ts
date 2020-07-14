import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, forkJoin } from 'rxjs';
import { VM, Team, Student } from '../models';
import { mergeMap, toArray, map } from 'rxjs/operators';
import { CdkMonitorFocus } from '@angular/cdk/a11y';

@Injectable({
  providedIn: 'root'
})
export class VmService {

  constructor(private http: HttpClient) { }

  getTeamVms(teamId: number){
    return this.http.get<VM[]>(`api/API/vms/teams/${teamId}`).pipe(
      mergeMap(vms => 
        forkJoin(vms.map((vm) => 
        this.http.get<Student[]>(`api/API/students/${vm.id}/owners`).pipe(
        map((owners: Student[]) => {
          vm.owners = owners;
          return vm;
        } ))
      )))
    );
  }

  getCourseVms(courseName: string): Observable<VM[]> {
    return this.http.get<VM[]>(`api/API/vms/courses/${courseName}`);
  }

  addVmService(vm: VM, teamId: number): Observable<VM> {
    return this.http.post<VM>(`api/API/vms/${teamId}`, vm);
    /* const studentsSerial = vm.owners.map(student => student.serial);
    vm.owners = null;
    this.http.post<VM>(`api/API/vms/${teamId}`, vm).subscribe( vm => {
      from(studentsSerial).pipe(
        mergeMap(serial => this.http.put<VM>(`/api/API/vms/${vm.id}/addOwner/${serial}`, null)),
        toArray()
      );
    }) */
  }

  addOwner(students: Student[], vmId: number): Observable<VM[]> {
    const studentsSerial = students.map(student => student.serial);
    return from(studentsSerial).pipe(
      mergeMap(serial => this.http.put<VM>(`/api/API/vms/${vmId}/addOwner/${serial}`, null)),
      toArray()
    );
  }

  onOffVm(vmId: number): Observable<VM> {
    return this.http.put<VM>(`api/API/vms/${vmId}/onOff`, null);
  }

  modifyVm(vm: VM): Observable<VM> {
    return this.http.put<VM>('api/API/vms', vm);
  }
  
  deleteVm(vmId: number): Observable<void> {
    return this.http.delete<void>(`api/API/vms/${vmId}`);
  }
}
