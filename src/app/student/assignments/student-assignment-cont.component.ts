import { Component, OnInit } from '@angular/core';
import { Assignment, Solution, SolutionService, AssignmentService } from 'src/app/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-assignment-cont',
  templateUrl: './student-assignment-cont.component.html',
  styles: []
})
export class StudentAssignmentContComponent implements OnInit {

  assignments$: Observable<Assignment[]>;
  solutions$: Observable<Solution[]>;
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

  selectedAssignment(assignment: Assignment) {
    this.solutions$ = this.solutionService.getSolutionHistory(localStorage.getItem("email").split("@")[0], assignment);
  }

  addSolution(event:{solution:Solution, assignment:Assignment}){
    this.solutionService
      .addSolution(event.solution, event.assignment)
      .subscribe(
        (item) =>
          (this.solutions$ = this.solutionService.getSolutionHistory(
            localStorage.getItem("email").split("@")[0], event.assignment
          ))
      );
  }

}
