import { Component, OnInit } from '@angular/core';
import {
  AssignmentService,
  Assignment,
  Solution,
  SolutionService,
  StudentService,
  Student,
} from '../../core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';


@Component({
  selector: 'app-teacher-assignment-cont',
  templateUrl: './teacher-assignment-cont.component.html',
  styles: [],
})
export class TeacherAssignmentContComponent implements OnInit {
  assignments$: Observable<Assignment[]>;
  solutions$: Observable<Solution[]>;
  enrolledStudents$: Observable<Student[]>;
  currentAssignment: Assignment;
  courseName: string;

  constructor(
    private assignmentService: AssignmentService,
    private solutionService: SolutionService,
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((url) => {
      this.courseName = url['courseName'];
      this.assignments$ = this.assignmentService.getAssignments(
        url['courseName']
      );
      this.enrolledStudents$ = this.studentService.getEnrolled(
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

  selectedEmitter(assignment: Assignment) {
    if (this.currentAssignment == null || assignment.id !== this.currentAssignment.id) {
      this.solutions$ = this.solutionService.getSolutions(assignment.id);
      this.currentAssignment = assignment;
    }
    else{
      this.solutions$ = of<Solution[]>([]);
      this.currentAssignment = null;
    }
  }
}
