import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Solution, Student } from '../models';
import { HttpClient } from '@angular/common/http';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SolutionService {
  constructor(private http: HttpClient) {}

  getSolutions(assignmnentId: number): Observable<Solution[]> {
    return this.http
      .get<Solution[]>(`/api/API/solutions/assignments/${assignmnentId}`)
      .pipe(
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
}
