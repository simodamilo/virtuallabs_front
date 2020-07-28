import { Component, Inject, ViewChild } from '@angular/core';
import { Course, CourseService } from 'src/app/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';

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
    private courseService: CourseService) {
    this.data == null
    ? this.courseForm = this.fb.group({
        name: ['', Validators.required],
        tag: ['', Validators.required],
        min: ['', Validators.required],
        max: ['', Validators.required],
      })
    : this.courseForm = this.fb.group({
        name: [this.data.name, Validators.required],
        tag: [this.data.tag, Validators.required],
        min: [this.data.min, Validators.required],
        max: [this.data.max, Validators.required],
      })
  }

  setCourse(){
    if(this.courseForm.valid){
      const course: Course = {
        name: this.courseForm.get('name').value,
        tag: this.courseForm.get('tag').value,
        min: this.courseForm.get('min').value,
        max: this.courseForm.get('max').value,
        enabled: this.status.checked,
      };
      this.data == null
      ? this.courseService.addCourse(course).subscribe(
          (course) => this.dialogRef.close(course),
          ()=> this.errorMsg = "qualcosa è andato storto"
        )
      : this.courseService.modifyCourse(course).subscribe(
          () => this.dialogRef.close(),
          () => this.errorMsg = "qualcosa è andato storto"
        )
    }
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
