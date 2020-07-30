import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService, StudentService } from 'src/app/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  message: string;
  title: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private studentService: StudentService) { }

  ngOnInit(): void {
    if(this.data.course != null) {
      this.title = "Delete course";
      this.message = `Are you sure you want to delete the course ${this.data.course.name}?`
    } else if(this.data.csv != null) {
      this.title = "Enroll students";
      this.message = "Are you sure you want to enroll from the csv?";
    }
  }

  confirm() {
    if(this.data.course != null) {
      this.courseService.deleteCourse(this.data.course).subscribe(
      () => {
        this.courseService.changeCourse();
        this.dialogRef.close();
      })
    } else if(this.data.csv != null) {
      this.studentService.enrollCSV(this.data.csv, this.data.courseName).subscribe(
       () => this.dialogRef.close(true),
       () => this.dialogRef.close(false)
     );
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
