import { Injectable } from '@angular/core';
import { Assignment } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {

  constructor(private http: HttpClient) {}

  getAssignmentContent(assignment: Assignment): Observable<Blob>{
    return this.http.get<Blob>(`/api/API/assignments/${assignment.id}`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  getCourseAssignments(courseName: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`/api/API/assignments/courses/${courseName}`);
  }

  addAssignment(assignment: Assignment, courseName: string): Observable<Assignment> {
    if(assignment.content.type != "image/jpeg" && assignment.content.type != "image/png") {
      return throwError({error: {message: 'File type not supported'}});
    } else {
      const formData = new FormData()
      formData.append('imageFile', assignment.content);
      assignment.content = null;
      return this.http.post<Assignment>(`/api/API/assignments/${courseName}`, assignment)
        .pipe(
          mergeMap(
            (assignment): Observable<Assignment> => this.http.put<Assignment>(`/api/API/assignments/${assignment.id}`, formData)
          )
        );
    }  
  }
  
}
