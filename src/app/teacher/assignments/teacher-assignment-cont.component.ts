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
  ) { }

  /**
   * Used to initilize the assignments when the component starts.
   */
  ngOnInit(): void {
    this.route.params.subscribe((url) => {
      this.courseName = url['courseName'];
      this.assignments$ = this.assignmentService.getCourseAssignments(this.courseName);
    });
  }

  /**
   * Used from the teacher to add an assignment.
   * 
   * @param assignment that is added.
   */
  addAssignment(assignment: Assignment) {
    this.resetErrors();
    this.assignmentService
      .addAssignment(assignment, this.courseName)
      .subscribe(
        () => this.assignments$ = this.assignmentService.getCourseAssignments(this.courseName),
        (err) => this.errorMsgAssignment = err.error.message
      );
  }

  /**
   * Used from the teacher to add a review to the solution of a student.
   * 
   * @param event 
   */
  addReview(event: { solution: Solution; assignment: Assignment; }) {
    this.resetErrors();
    this.solutionService
      .addSolutionReview(event.solution, event.assignment)
      .subscribe(
        () => this.solutions$ = this.solutionService.getAssignmentSolutions(event.assignment.id),
        (err) => this.errorMsgSolution = err.error.message
      );
  }

  /**
   * Used to get solutions of all student for a specific assignment.
   * 
   * @param assignment of the solutions searched.
   */
  selectedAssignment(assignment: Assignment) {
    this.resetErrors();
    this.solutions$ = this.solutionService.getAssignmentSolutions(assignment.id);
  }

  /**
   * Used to get the history of a solution proposed by the student for an assignment.
   * 
   * @param event contains the solution and the assignment.
   */
  loadHistory(event: { solution: Solution; assignment: Assignment; }) {
    this.resetErrors();
    this.history$ = this.solutionService.getStudentSolutions(
      event.solution.student.serial,
      event.assignment
    );
  }

  /**
   * Used to clear all the error field when an operations is executed.
   */
  resetErrors() {
    this.errorMsgAssignment = "";
    this.errorMsgSolution = "";
  }
}
