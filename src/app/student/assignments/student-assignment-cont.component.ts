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

  constructor(
    private assignmentService: AssignmentService,
    private solutionService: SolutionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(url =>
      this.assignments$ = this.assignmentService.getAssignments(url['courseName']));
  }

  selectedAssignment(assignment: Assignment) {
    this.solutions$ = this.solutionService.getSolutionHistory(localStorage.getItem("serial"), assignment);
  }

  addSolution(event:{solution:Solution, assignment:Assignment}){
    event.solution.state == 1 
    ? this.solutionService
        .addReaded(event.solution, event.assignment, localStorage.getItem("serial"))
        .subscribe(() => this.solutions$ = this.solutionService.getSolutionHistory(localStorage.getItem("serial"), event.assignment)) 
    : this.solutionService
        .addDelivered(event.solution, event.assignment)
        .subscribe(() => this.solutions$ = this.solutionService.getSolutionHistory(localStorage.getItem("serial"), event.assignment))
  }
}
