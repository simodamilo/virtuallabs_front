import { Injectable } from '@angular/core';
import { Course } from '../models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    if(localStorage.getItem("role") === "student")
      return this.http.get<Course[]>(`/api/API/courses/students`);

    return this.http.get<Course[]>(`/api/API/courses/teachers`);
  }

  getCourseById(courseName: string): Observable<Course> {
    return this.http.get<Course>(`/api/API/courses/${courseName}`);
  }
}
