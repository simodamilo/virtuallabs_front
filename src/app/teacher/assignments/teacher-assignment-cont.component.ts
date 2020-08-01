import { Component, OnInit } from '@angular/core';
import {
  AssignmentService,
  Assignment,
  Solution,
  SolutionService
} from '../../core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-teacher-assignment-cont',
  templateUrl: './teacher-assignment-cont.component.html',
  styles: [],
})
export class TeacherAssignmentContComponent implements OnInit {
  assignments$: Observable<Assignment[]>;
  solutions$: Observable<Solution[]>;
  history$: Observable<Solution[]>;
  courseName: string;
  errorMsgAssignment: string;
  errorMsgSolution: string;

  constructor(
    private assignmentService: AssignmentService,
    private solutionService: SolutionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((url) => {
      this.courseName = url['courseName'];
      this.assignments$ = this.assignmentService.getCourseAssignments(this.courseName);
    });
  }

  addAssignment(assignment: Assignment) {
    this.resetErrors();
    this.assignmentService
      .addAssignment(assignment, this.courseName)
      .subscribe(
        () =>this.assignments$ = this.assignmentService.getCourseAssignments(this.courseName),
        (err) => this.errorMsgAssignment = err.error.message
      );
  }

  addReview(event: { solution: Solution; assignment: Assignment; }) {
    this.resetErrors();

    this.solutionService
      .addSolutionReview(event.solution, event.assignment)
      .subscribe(
        () => this.solutions$ = this.solutionService.getAssignmentSolutions(event.assignment.id),
        (err) => this.errorMsgSolution = err.error.message
      );
  }

  selectedAssignment(assignment: Assignment) {
    this.resetErrors();
    this.solutions$ = this.solutionService.getAssignmentSolutions(assignment.id);
  }

  loadHistory(event: { solution: Solution; assignment: Assignment; }) {
    this.resetErrors();
    this.history$ = this.solutionService.getStudentSolutions(
      event.solution.student.serial,
      event.assignment
    );
  }

  resetErrors() {
    this.errorMsgAssignment = "";
    this.errorMsgSolution = "";
  }
}
