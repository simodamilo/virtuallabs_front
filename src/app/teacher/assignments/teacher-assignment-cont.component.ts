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

  constructor(
    private assignmentService: AssignmentService,
    private solutionService: SolutionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((url) => {
      this.courseName = url['courseName'];
      this.assignments$ = this.assignmentService.getAssignments(
        url['courseName']
      );
    });
  }

  addAssignment(assignment: Assignment) {
    this.assignmentService
      .add(assignment, this.courseName)
      .subscribe(
        (item) =>
          (this.assignments$ = this.assignmentService.getAssignments(
            this.courseName
          ))
      );
  }

  addReview(event: { solution: Solution; assignment: Assignment; }) {
    console.log(event.solution)
    this.solutionService
      .addReview(event.solution, event.assignment)
      .subscribe(
        (item) =>
          (this.solutions$ = this.solutionService.getSolutions(
            event.assignment.id
          ))
      );
  }

  selectedAssignment(assignment: Assignment) {
    this.solutions$ = this.solutionService.getSolutions(assignment.id);
  }

  loadHistory(event: { solution: Solution; assignment: Assignment; }) {
    this.history$ = this.solutionService.getSolutionHistory(
      event.solution.student.serial,
      event.assignment
    );
  }
}
