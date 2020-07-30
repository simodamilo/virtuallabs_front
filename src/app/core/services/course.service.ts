import { Injectable } from '@angular/core';
import { Course } from '../models';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private courseSubject = new ReplaySubject<Course>(1);
  public course = this.courseSubject.asObservable();

  constructor(private http: HttpClient) { }

  changeCourse() {
    this.courseSubject.next(null);
  }

  getCourse(courseName: string): Observable<Course> {
    return this.http.get<Course>(`/api/API/courses/${courseName}`);
  }

  getCourses(): Observable<Course[]> {
    if(localStorage.getItem("role") === "student")
      return this.http.get<Course[]>(`/api/API/courses/students`);

    return this.http.get<Course[]>(`/api/API/courses/teachers`);
  }

  getCourseById(courseName: string): Observable<Course> {
    return this.http.get<Course>(`/api/API/courses/${courseName}`);
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`/api/API/courses/`, course);
  }

  modifyCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`/api/API/courses/`, course);
  }

  deleteCourse(course: Course) {
    return this.http.delete(`/api/API/courses/${course.name}`);
  }
}
