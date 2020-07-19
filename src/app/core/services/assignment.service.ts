import { Injectable } from '@angular/core';
import { Assignment } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { AssignmentsTableComponent } from 'src/app/shared/assignments-table/assignments-table.component';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  constructor(private http: HttpClient) {}

  getAssignments(courseName: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(
      `/api/API/assignments/courses/${courseName}`
    );
  }

  add(assignment: Assignment, courseName: string): Observable<Assignment> {
    const formData = new FormData();
    formData.append('imageFile', assignment.content);
    assignment.content = null;
    return this.http
      .post<Assignment>(`/api/API/assignments/${courseName}`, assignment)
      .pipe(
        mergeMap(
          (assignment): Observable<Assignment> => {
            console.log("2")
            return this.http.put<Assignment>(
              `/api/API/assignments/${assignment.id}`,
              formData
            );
          }
        )
      );
  }
}
