import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentService, TeacherService } from 'src/app/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent implements OnInit, OnDestroy {
  selectedFile: File;
  email: string = localStorage.getItem("email");
  imageURL: string;
  imageSafeURL: SafeUrl;

  constructor(public dialogRef: MatDialogRef<ProfileDialogComponent>,
    private authService: AuthService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private sanitizer: DomSanitizer,
    private router: Router) {}

  ngOnInit(): void {
    localStorage.getItem("role")=="student" 
    ? this.studentService.getImage().subscribe((result) => this.createURL(result))
    : this.teacherService.getImage().subscribe((result) => this.createURL(result));
  }

  createURL(blob: Blob){
    this.imageURL = URL.createObjectURL(blob);
    this.imageSafeURL = this.sanitizer.bypassSecurityTrustUrl(this.imageURL);
  }

  onChangeEvent(event){
    this.teacherService.uploadImage(event.target.files[0]).subscribe( item =>
      console.log("eureka")
    )
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['home']);
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.imageURL)
  }

}
