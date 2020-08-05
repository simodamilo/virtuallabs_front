import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { Teacher } from '..';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  getTeacher(): Observable<Teacher> {
    return this.http.get<Teacher>(`/api/API/teachers/${localStorage.getItem("serial")}/getOne`);
  }

  getTeacherImage(): Observable<Blob> {
    return this.http.get<Blob>(`/api/API/teachers/${localStorage.getItem("serial")}/image`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  getAllTeachers(courseName: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`/api/API/teachers/${courseName}/getAll`);
  }

  getCourseOwners(courseName: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`/api/API/teachers/${courseName}/getOwners`);
  }

  addTeacherToCourse(teacher: Teacher, courseName: string): Observable<Teacher> {
    return this.http.post<Teacher>(`/api/API/teachers/${courseName}/assign`, { serial: teacher.serial })
  }

  uploadImage(file: File): Observable<Blob> {
    if (file.type != "image/jpeg" && file.type != "image/png") {
      return throwError({ error: { message: 'File type not supported' } });
    } else {
      const formData = new FormData();
      formData.append("imageFile", file);
      return this.http.put<Blob>("/api/API/teachers/uploadImage", formData, { observe: 'body', responseType: 'blob' as 'json' });
    }
  }

  deleteTeacherFromCourse(teachers: Teacher[], courseName: string): Observable<Teacher[]> {
    return from(teachers).pipe(
      mergeMap(teacher => this.http.delete<Teacher>(`/api/API/teachers/${courseName}/deleteTeacher/${teacher.serial}`)),
      toArray()
    );
  }

}
