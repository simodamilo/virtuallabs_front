import { Injectable } from '@angular/core';
import { Assignment } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  constructor(private http: HttpClient) {}

  getAssignments(courseName: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`/api/API/assignments/courses/${courseName}`);
  }

  getContent(assignment: Assignment): Observable<Blob>{
    return this.http.get<Blob>(`/api/API/assignments/${assignment.id}`, { observe: 'body', responseType: 'blob' as 'json' })
  }

  add(assignment: Assignment, courseName: string): Observable<Assignment> {
    const formData = new FormData()
    formData.append('imageFile', assignment.content);
    assignment.content = null;
    return this.http.post<Assignment>(`/api/API/assignments/${courseName}`, assignment)
      .pipe(
        mergeMap(
          (assignment): Observable<Assignment> => {
            return this.http.put<Assignment>(`/api/API/assignments/${assignment.id}`, formData);
          }
        )
      );
  }
}
