import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentService, TeacherService, Student, Teacher } from 'src/app/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent implements OnInit {
  selectedFile: File;
  role: string;
  student: Student = {} as Student;
  teacher: Teacher = {} as Teacher;
  imageURL: string;
  imageSafeURL: SafeUrl;
  errorMsg: string = "";

  constructor(public dialogRef: MatDialogRef<ProfileDialogComponent>,
    private authService: AuthService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private sanitizer: DomSanitizer,
    private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem("role")
    if(this.role === "student" ){
      this.studentService.getStudent().subscribe(result=> this.student = result)      
      this.studentService.getStudentImage().subscribe((result) => this.createURL(result));
    }
    else{
      this.teacherService.getTeacher().subscribe(result=> this.teacher = result)
      this.teacherService.getTeacherImage().subscribe((result) => this.createURL(result));
    }
  }

  createURL(blob: Blob){
    if(blob.size === 0){
      this.imageSafeURL = "../../assets/user_icon_black.svg"
    }else{
      this.imageURL = URL.createObjectURL(blob);
      this.imageSafeURL = this.sanitizer.bypassSecurityTrustUrl(this.imageURL);
    }
  }

  onChangeEvent(file: File){
    this.role === "student"
    ? this.studentService.uploadImage(file).subscribe( 
      (image) => {
        this.createURL(image);
        this.dialogRef.close(image);
      }, 
      (err) => this.errorMsg = err.error.message
    )
    : this.teacherService.uploadImage(file).subscribe( 
      (image) => {
        this.createURL(image);
        this.dialogRef.close(image);
      }, 
      (err) => this.errorMsg = err.error.message
    )
  }

  logout() {
    this.authService.logout();
    this.dialogRef.close();
    this.router.navigate(['home']);
  }
}
