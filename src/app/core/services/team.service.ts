import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team.model';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Student } from '..';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  getStudentTeamByCourse(courseName: string): Observable<Team> {
    return this.http.get<Team>(`api/API/teams/${courseName}/student`).pipe(
      mergeMap(team => this.http.get<Student[]>(`api/API/students/${team.id}/members`).pipe(
        map((members: Student[]) => {
          team.members = members;
          return team;
        }))),
      catchError(err => of(null))
    );
  }

  getCourseTeams(courseName: string): Observable<Team[]> {
    return this.http.get<Team[]>(`api/API/teams/courses/${courseName}`).pipe(
      mergeMap( teams =>
        forkJoin( teams.map( team =>
          this.http.get<Student[]>(`api/API/students/${team.id}/members`).pipe(
            map((members: Student[]) => {
              team.members = members;
              return team;
            }))
      )))
    );
  }

  modifyTeam(team: Team): Observable<Team> {
    return this.http.put<Team>(`api/API/teams`, team);
  }

  proposeTeam(courseName: string, teamName: string, timeout: number, studentSerials: string[]): Observable<Team> {
    return this.http.post<Team>(`api/API/teams/${courseName}`, {name: teamName, serials: studentSerials, timeout: timeout});
  }

  getPendingTeams() {
    //prendere tutti i team "pending", dei team prendere tutti i membri come facciamo con getCourseTeams
    //e poi per ogni membro prendere lo stato vedendo il relativo token(?)
  }
}
