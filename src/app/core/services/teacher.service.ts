import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '..';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  uploadImage(event: File){
    console.log(event)
    const formData = new FormData()
    formData.append("imageFile", event)
    return this.http.put("/api/API/teachers/uploadImage", formData)
  }
}
