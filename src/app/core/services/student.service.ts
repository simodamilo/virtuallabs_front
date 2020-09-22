import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student, Team } from '..';
import { Observable, from, throwError, forkJoin } from 'rxjs';
import { mergeMap, toArray, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getStudent(): Observable<Student> {
    return this.http.get<Student>(`api/API/students/${localStorage.getItem("serial")}/getOne`);
  }

  getStudentImage(): Observable<Blob> {
    return this.http.get<Blob>(`/api/API/students/${localStorage.getItem("serial")}/image`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  getAllStudents(courseName: string): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/API/students/${courseName}/getAll`);
  }

  getEnrolledStudents(courseName: string): Observable<Student[]> {
    return this.http
      .get<Student[]>(`/api/API/students/${courseName}/getEnrolled`).pipe(
        mergeMap((students) =>
          forkJoin(
            students.map((student) =>
              this.http.get<Team>(`/api/API/teams/${courseName}/${student.serial}`).pipe(
                map((team: Team) => {
                  student.team = team;
                  return student;
                })
              )
            )
          )
        )
      );
  }

  getAvailableStudents(courseName: string): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/API/students/${courseName}/available`);
  }

  getTeamStudents(teamId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`api/API/students/${teamId}/members`);
  }

  addStudentToCourse(student: Student, courseName: string): Observable<Student> {
    return this.http.post<Student>(`/api/API/students/${courseName}/enroll`, { serial: student.serial });
  }

  enrollCSV(file: File, courseName: string): Observable<Student[]> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<Student[]>(`/api/API/students/${courseName}/enrollCsv`, formData);
  }

  uploadImage(file: File): Observable<Blob> {
    if (file.type != "image/jpeg" && file.type != "image/png") {
      return throwError({ error: { message: 'File type not supported' } });
    } else if (file.size > 1048575) {
      return throwError({ error: { message: 'File size not acceptable' } });
    } else {
      const formData = new FormData();
      formData.append("imageFile", file);
      return this.http.put<Blob>("/api/API/students/uploadImage", formData, { observe: 'body', responseType: 'blob' as 'json' });
    }
  }

  deleteStudentFromCourse(students: Student[], courseName: string) {
    return from(students).pipe(
      mergeMap(student => this.http.delete<Student>(`/api/API/students/${courseName}/deleteStudent/${student.serial}`)),
      toArray()
    );
  }
}
