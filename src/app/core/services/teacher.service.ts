import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  getImage(): Observable<Blob>{
    const serial = localStorage.getItem("email").split("@")[0];
    return this.http.get<Blob>(`/api/API/teachers/${serial}`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  uploadImage(event: File){
    const formData = new FormData()
    formData.append("imageFile", event)
    return this.http.put("/api/API/teachers/uploadImage", formData)
  }
}
