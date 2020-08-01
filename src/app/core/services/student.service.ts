import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '..';
import { Observable, from, throwError } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getStudent(): Observable<Student> {
    const studentSerial = localStorage.getItem("serial");
    return this.http.get<Student>(`api/API/students/${studentSerial}/getOne`);
  }

  getStudentImage(): Observable<Blob>{
    const studentSerial = localStorage.getItem("serial");
    return this.http.get<Blob>(`/api/API/students/${studentSerial}/image`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  getAllStudents(courseName: string): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/API/students/${courseName}/getAll`);
  }

  getEnrolledStudents(courseName: string):Observable<Student[]> {
    return this.http.get<Student[]>(`/api/API/students/${courseName}/getEnrolled`);
  }

  getAvailableStudents(courseName: string): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/API/students/${courseName}/available`);
  }

  getTeamStudents(teamId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`api/API/students/${teamId}/members`);
  }

  addStudentToCourse(student: Student, courseName: string): Observable<Student> {    
    return this.http.post<Student>(`/api/API/students/${courseName}/enroll`, {serial:student.serial});
  }

  enrollCSV(file:File, courseName: string): Observable<Student[]>{
    const formData = new FormData()
    formData.append("file", file)
    return this.http.post<Student[]>(`/api/API/students/${courseName}/enrollCsv`, formData)
  }

  uploadImage(file: File): Observable<Blob>{
    if(file.type != "image/jpeg" && file.type != "image/png") {
      return throwError({error: {message: 'File type not supported'}});
    } else {
      const formData = new FormData();
      formData.append("imageFile", file);
      return this.http.put<Blob>("/api/API/students/uploadImage", formData, { observe: 'body', responseType: 'blob' as 'json' });
    }
  }

  deleteStudentFromCourse(students: Student[], courseName: string){  
    return from(students).pipe(
      mergeMap(student => this.http.delete<Student>(`/api/API/students/${courseName}/deleteStudent/${student.serial}`)),
      toArray()
    );
  } 
}
