import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Teacher } from '..';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  getTeacher(): Observable<Teacher>{
    const teacherSerial = localStorage.getItem("serial");
    return this.http.get<Teacher>(`/api/API/teachers/${teacherSerial}/getOne`);
  }

  getImage(): Observable<Blob>{
    const teacherSerial = localStorage.getItem("serial");
    return this.http.get<Blob>(`/api/API/teachers/${teacherSerial}/image`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  getAllTeachers(courseName: string): Observable<Teacher[]>{
    return this.http.get<Teacher[]>(`/api/API/teachers/${courseName}/getAll`);
  }

  getCourseOwners(courseName: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`/api/API/teachers/${courseName}/getOwners`);
  }

  assignTeacher(teacher: Teacher, courseName: string): Observable<Teacher>{
    return this.http.post<Teacher>(`/api/API/teachers/${courseName}/assign`, {serial:teacher.serial})
  }

  uploadImage(event: File): Observable<Blob>{
    const formData = new FormData();
    formData.append("imageFile", event);
    return this.http.put<Blob>("/api/API/teachers/uploadImage", formData, { observe: 'body', responseType: 'blob' as 'json' });
  }

  remove(teachers: Teacher[], courseName: string): Observable<Teacher[]>{  
    return from(teachers).pipe(
      mergeMap(teacher => this.http.delete<Teacher>(`/api/API/teachers/${courseName}/deleteTeacher/${teacher.serial}`)),
      toArray()
    );

    /* return from(teachers).pipe(
      mergeMap(teacher => {
        return this.http.delete(`/api/API/teachers/${courseName}/deleteTeacher/${teacher.serial}`).pipe(
          mergeMap(() => {
            if(teacher.serial == localStorage.getItem('serial'))
              return this.http.get<Course[]>(`/api/API/courses/teachers`)
          })
        );
      })
    ); */
  } 

}
