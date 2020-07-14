import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  getStudentTeamByCourse(courseName: string): Observable<Team> {
    return this.http.get<Team>(`api/API/teams/${courseName}/student`);
  }
}
