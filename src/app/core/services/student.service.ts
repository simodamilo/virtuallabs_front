import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '..';
import { Observable, from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getTeamStudents(teamId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`api/API/students/${teamId}/members`);
  }

  getAllStudents(): Observable<Student[]> {
    console.log("getAllStudents service")
    return this.http.get<Student[]>(`/api/API/students`);
  }

  getEnrolled(courseName: string):Observable<Student[]> {
    return this.http.get<Student[]>(`/api/API/students/${courseName}/enrolled`);
  }

  getAvailable(courseName: string): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/API/students/${courseName}/available`);
  }

  enroll(students: Student[], courseName: string): Observable<Student[]> {    
    return from(students).pipe(
      mergeMap(student => this.http.post<Student>(`/api/API/students/${courseName}/enroll`, {serial:student.serial})),
      toArray()
    );
  }

  enrollCSV(file:File, courseName: string): Observable<Student[]>{
    const formData = new FormData()
    formData.append("file", file)
    return this.http.post<Student[]>(`/api/API/students/${courseName}/enrollCsv`, formData)
  }

  remove(students: Student[], courseName: string){  
    return from(students).pipe(
      mergeMap(student => this.http.delete<Student>(`/api/API/students/${courseName}/deleteStudent/${student.serial}`)),
      toArray()
    );
  } 

  getImage(): Observable<Blob>{
    const serial = localStorage.getItem("email").split("@")[0];
    return this.http.get<Blob>(`/api/API/students/${serial}`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  uploadImage(file: File): Observable<Student>{
    const formData = new FormData()
    formData.append("imageFile", file)
    return this.http.put<Student>("/api/API/students/uploadImage", formData)
  }
}
