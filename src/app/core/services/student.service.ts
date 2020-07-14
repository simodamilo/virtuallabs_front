import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { Observable, from, of } from 'rxjs';
import { mergeMap, toArray, concatMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { VM } from '..';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getTeamStudents(teamId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`api/API/students/${teamId}/members`);
  }

  /* getAllStudents(): Observable<Student[]> {
    console.log("getAllStudents service")
    return this.http.get<Student[]>(`/api/students`);
  }

  getEnrolled(courseId: number):Observable<Student[]> {
    console.log("getEnrolled service")
    return this.http.get<Student[]>(`/api/students?courseId=${courseId}&_expand=group`);
  }


  updateEnrolled(students: Student[], courseId: number): Observable<Student[]> {    
    students.forEach(s => s.courseId = courseId);
    console.log(students);
    
    return from(students).pipe(
      mergeMap(student => this.http.put<Student>(`/api/students/${student.id}`, student)),
      toArray()
    );
  } */

}
