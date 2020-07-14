import { Injectable } from '@angular/core';
import { Assignment } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  constructor(private http: HttpClient) { }

  getAssignments(courseName: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`/api/API/assignments/courses/${courseName}`);
  }

  add(assignment: Assignment, courseName: string): Observable<Assignment> {
    return this.http.post<Assignment>(`/api/API/assignments/${courseName}`, assignment);
  }

}
