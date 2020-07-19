import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentService, TeacherService } from 'src/app/core';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent implements OnInit {

  email: string = localStorage.getItem("email");
  constructor(public dialogRef: MatDialogRef<ProfileDialogComponent>, private authService: AuthService, private teacherService: TeacherService, private router: Router) { }
  selectedFile: File;
  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['home']);
    this.dialogRef.close();
  }

  modifyImage() {
    
  }
  onChangeEvent(event){
    console.log(event.target.files[0])
    this.teacherService.uploadImage(event.target.files[0]).subscribe( item =>
      console.log("eureka")
    )
  }

}
