import { Injectable } from '@angular/core';
import { Observable, forkJoin, observable, of, throwError } from 'rxjs';
import { Solution, Student, Assignment } from '../models';
import { HttpClient } from '@angular/common/http';
import { mergeMap, map } from 'rxjs/operators';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SolutionService {

  constructor(private http: HttpClient) { }

  getSolutionContent(solution: Solution): Observable<Blob> {
    return this.http.get<Blob>(`/api/API/solutions/${solution.id}`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  getAssignmentSolutions(assignmnentId: number): Observable<Solution[]> {
    return this.http
      .get<Solution[]>(`/api/API/solutions/assignments/${assignmnentId}`).pipe(
        mergeMap((solutions) =>
          forkJoin(
            solutions.map((solution) =>
              this.http.get(`/api/API/students/solutions/${solution.id}`).pipe(
                map((student: Student) => {
                  solution.student = student;
                  return solution;
                })
              )
            )
          )
        )
      );
  }

  getStudentSolutions(serial: String, assignment: Assignment): Observable<Solution[]> {
    return this.http.get<Solution[]>(`/api/API/solutions/assignments/${assignment.id}/students/${serial}`)
  }

  addReaded(solution: Solution, assignment: Assignment, serial: string): Observable<Solution> {
    return this.http.get<Solution[]>(`/api/API/solutions/assignments/${assignment.id}/students/${serial}`).pipe(
      mergeMap((item) => item.length < 2 ? this.http.post<Solution>(`/api/API/solutions/${assignment.id}`, solution) : of({} as Solution))
    )
  }

  addDelivered(solution: Solution, assignment: Assignment): Observable<Solution> {
    if (solution.content.type != "image/jpeg" && solution.content.type != "image/png") {
      return throwError({ error: { message: 'File type not supported' } });
    } else {
      const formData = new FormData()
      formData.append('imageFile', solution.content);
      solution.content = null;
      return this.http.post<Solution>(`/api/API/solutions/${assignment.id}`, solution).pipe(
        mergeMap((solutionResult) => this.http.put<Solution>(`/api/API/solutions/${solutionResult.id}`, formData))
      );
    }
  }

  addSolutionReview(solution: Solution, assignment: Assignment): Observable<Solution> {
    if (solution.content.type != "image/jpeg" && solution.content.type != "image/png") {
      return throwError({ error: { message: 'File type not supported' } });
    } else {
      const formData = new FormData()
      formData.append('imageFile', solution.content);
      solution.content = null;
      return this.http.post<Solution>(`/api/API/solutions/${assignment.id}/${solution.student.serial}`, solution).pipe(
        mergeMap((assignment) => this.http.put<Solution>(`/api/API/solutions/${assignment.id}`, formData))
      );
    }
  }
}
