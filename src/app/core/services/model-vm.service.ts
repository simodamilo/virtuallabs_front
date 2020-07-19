import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelVM } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ModelVmService {

  constructor(private http: HttpClient) { }

  getModelVm(courseName: string): Observable<ModelVM> {
    return this.http.get<ModelVM>(`api/API/modelVms/${courseName}`);
  }
}
