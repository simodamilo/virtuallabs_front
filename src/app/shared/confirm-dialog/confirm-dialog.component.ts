import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService, StudentService } from 'src/app/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `<h2 mat-dialog-title>{{title}}</h2>
              <mat-dialog-content>
                <h3>{{message}}</h3>
              </mat-dialog-content>
              <mat-dialog-actions>
                <button mat-stroked-button color="primary" (click)="closeDialog()">Cancel</button>
                <button mat-flat-button color="primary" (click)="confirm()">Confirm</button>
              </mat-dialog-actions>`,
  styles: []
})
export class ConfirmDialogComponent implements OnInit {

  message: string;
  title: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private studentService: StudentService) { }

  /**
   * Used to set the title and the message of the dialog depending on the passed parameter.
   */
  ngOnInit(): void {
    if (this.data.course != null) {
      this.title = "Delete course";
      this.message = `Are you sure you want to delete the course ${this.data.course.name}?`
    } else if (this.data.csv != null) {
      this.title = "Enroll students";
      this.message = "Are you sure you want to enroll from the csv?";
    }
  }

  /**
   * Used to confirm the deletion of the course or to confirm the insertion of 
   * many students inside a course by using a CSV file.
   */
  confirm() {
    if (this.data.course != null) {
      this.courseService.deleteCourse(this.data.course).subscribe(
        () => {
          this.courseService.changeCourse();
          this.dialogRef.close();
        })
    } else if (this.data.csv != null) {
      this.studentService.enrollCSV(this.data.csv, this.data.courseName).subscribe(
        () => this.dialogRef.close(true),
        () => this.dialogRef.close(false)
      );
    }
  }

  /**
   * Used to close the dialog by passing false.
   */
  closeDialog() {
    this.dialogRef.close(false);
  }

}
