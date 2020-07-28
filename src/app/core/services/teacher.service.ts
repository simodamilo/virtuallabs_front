import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '..';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  getTeacher(): Observable<Teacher>{
    const teacherSerial = localStorage.getItem("serial");
    return this.http.get<Teacher>(`/api/API/teachers/${teacherSerial}`);
  }

  getAllTeachers(): Observable<Teacher[]>{
    return this.http.get<Teacher[]>(`/api/API/teachers`);
  }

  assignTeacher(teacher: Teacher, courseName: string): Observable<Teacher>{
    return this.http.post<Teacher>(`/api/API/teachers/${courseName}/assign`, {serial:teacher.serial})
  }

  getImage(): Observable<Blob>{
    const teacherSerial = localStorage.getItem("serial");
    return this.http.get<Blob>(`/api/API/teachers/${teacherSerial}/image`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  uploadImage(event: File){
    const formData = new FormData()
    formData.append("imageFile", event)
    return this.http.put("/api/API/teachers/uploadImage", formData)
  }
}
