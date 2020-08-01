import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, forkJoin, of } from 'rxjs';
import { VM, Student, ModelVM } from '../models';
import { mergeMap, map } from 'rxjs/operators';

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

  addVm(vm: VM, teamId: number): Observable<VM> {
    return this.http.post<VM>(`api/API/vms/${teamId}`, vm).pipe(
      mergeMap((vm1): Observable<VM> => {
        if(vm.owners.length > 0) {
          return from(vm.owners).pipe(
            mergeMap(student => this.http.put<VM>(`/api/API/vms/${vm1.id}/addOwner/${student.serial}`, null))
          )
        } else {
          return of(vm1);
        }
      })
    );
  }

  modifyVm(vm: VM): Observable<VM> {
    return this.http.put<VM>(`api/API/vms/`, vm).pipe(
      mergeMap((vm1): Observable<VM> => {
        if(vm.owners.length > 0) {
          return from(vm.owners).pipe(
            mergeMap(student => this.http.put<VM>(`/api/API/vms/${vm1.id}/addOwner/${student.serial}`, null))
          )
        } else {
          return of(vm1);
        }
      })
    );
  }

  onOffVm(vmId: number): Observable<VM> {
    return this.http.put<VM>(`api/API/vms/${vmId}/onOff`, null);
  }
  
  deleteVm(vmId: number): Observable<void> {
    return this.http.delete<void>(`api/API/vms/${vmId}`);
  }

  getContent(courseName: string): Observable<Blob>{
    return this.http.get<ModelVM>(`api/API/modelVms/${courseName}`).pipe(
      mergeMap((modelVm: ModelVM) => {
        return this.http.get<Blob>(`/api/API/modelVms/${modelVm.id}/image`, { observe: 'body', responseType: 'blob' as 'json' })
      })
    );
  }
}
