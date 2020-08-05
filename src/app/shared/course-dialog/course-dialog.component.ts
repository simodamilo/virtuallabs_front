import { Component, Inject, ViewChild } from '@angular/core';
import { Course, CourseService } from 'src/app/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent {

  @ViewChild(MatSlideToggle) status: MatSlideToggle;

  courseForm: FormGroup;
  errorMsg: string;

  constructor(public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Course,
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router) {
    this.data == null
      ? this.courseForm = this.fb.group({
        name: ['', Validators.required],
        tag: ['', Validators.required],
        min: ['', Validators.required],
        max: ['', Validators.required],
      })
      : this.courseForm = this.fb.group({
        name: [{ value: this.data.name, disabled: true }, Validators.required],
        tag: [this.data.tag, Validators.required],
        min: [this.data.min, Validators.required],
        max: [this.data.max, Validators.required],
      })
  }

  setCourse() {
    if (this.courseForm.valid) {
      const course: Course = {
        name: this.courseForm.get('name').value,
        tag: this.courseForm.get('tag').value,
        min: this.courseForm.get('min').value,
        max: this.courseForm.get('max').value,
        enabled: this.status.checked,
      };

      this.data == null
      ? this.courseService.addCourse(course).subscribe(
        (course) => {
          this.dialogRef.close(course);
          this.courseService.changeCourse();
          this.router.navigate(["teacher", "courses", course.name, "course"]);
        },
        (err) => this.errorMsg = err.error.message)
      : this.courseService.modifyCourse(course).subscribe(
        (course) => {
          this.dialogRef.close(course);
          this.courseService.changeCourse();
        },
        (err) => this.errorMsg = err.error.message)
    }
  }

  closeDialog() {
    this.dialogRef.close(this.data);
  }

  getErrorNameMessage() {
    if (this.courseForm.get('name').hasError('required'))
      return 'You must enter a value';
  }

  getErrorTagMessage() {
    if (this.courseForm.get('tag').hasError('required'))
      return 'You must enter a value';
  }

  getErrorMinMessage() {
    if (this.courseForm.get('min').hasError('required'))
      return 'You must enter a value';
  }

  getErrorMaxMessage() {
    if (this.courseForm.get('max').hasError('required'))
      return 'You must enter a value';
  }
}
