import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ModelVM } from '../models';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelVmService {

  constructor(private http: HttpClient) { }

  getModelVm(courseName: string): Observable<ModelVM> {
    return this.http.get<ModelVM>(`api/API/modelVms/${courseName}`);
  }

  getModelVmContent(modelVm: ModelVM): Observable<Blob> {
    return this.http.get<Blob>(`/api/API/modelVms/${modelVm.id}/image`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  addModelVm(modelVm: ModelVM, courseName: string): Observable<ModelVM> {
    if (modelVm.content.type != "image/jpeg" && modelVm.content.type != "image/png") {
      return throwError({ error: { message: 'File type not supported' } });
    } else if (modelVm.content.size > 1048575) {
      return throwError({ error: { message: 'File size not acceptable' } });
    } else {
      const formData = new FormData();
      formData.append('imageFile', modelVm.content);
      modelVm.content = null;
      return this.http.post<ModelVM>(`api/API/modelVms/${courseName}`, modelVm).pipe(
        mergeMap((modelVm): Observable<ModelVM> => this.http.put<ModelVM>(`api/API/modelVms/${modelVm.id}`, formData))
      );
    }
  }

  deleteModelVm(modelVmId: number) {
    return this.http.delete(`api/API/modelVms/${modelVmId}`);
  }
}
