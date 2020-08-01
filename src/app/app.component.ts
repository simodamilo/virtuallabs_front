import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course, CourseService, StudentService, TeacherService } from './core';
import { ProfileDialogComponent } from './shared/profile-dialog/profile-dialog.component';
import { LoginDialogComponent } from './auth/login-dialog.component';
import { CourseDialogComponent } from './shared/course-dialog/course-dialog.component';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  @ViewChild("rla") routerLinkActive: any;

  title = 'VirtualLabs';

  logged: boolean;
  urlSub: Subscription;
  authSub: Subscription;
  courses: Course[] = [];
  selectedCourse: string;
  tabs: string[];
  role: string;
  isAddingCourse: boolean;
  imageURL: string;
  imageSafeURL: SafeUrl;
  selectedTab: string;

  constructor(
    private courseService: CourseService,
    public profileDialog: MatDialog,
    public loginDialog: MatDialog,
    public courseDialog: MatDialog,
    private authService: AuthService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
  ){}

  ngOnInit() {
    this.authService.startUp();
    this.authSub = this.authService.isAuthenticated.subscribe((authenticated) => {
      this.logged = authenticated;
      if (authenticated === true) {
        this.role = localStorage.getItem("role");
        this.loadImage();
        this.setTabs();
        this.getCourses();
      }
    });
    this.reloadCourses();
    this.openLoginDialog();
  }

  reloadCourses() {
    this.courseService.course.subscribe(course => {
      if(course == null)
        this.getCourses();
    });
  }

  loadImage(){
    this.role === 'student'
    ? this.studentService.getStudentImage().subscribe((result) => this.createURL(result))
    : this.teacherService.getTeacherImage().subscribe((result) => this.createURL(result))
  }

  createURL(blob: Blob){
    if(blob.size === 0){
      this.imageSafeURL = "../../assets/user_icon.svg"
    }else{
    this.imageURL = URL.createObjectURL(blob);
    this.imageSafeURL = this.sanitizer.bypassSecurityTrustUrl(this.imageURL);
    }
  }

  setTabs() {
    if(this.role === 'student') {
      this.tabs = ['teams', 'vms', 'assignments'];
      this.selectedTab = 'teams';
    } else {
      this.tabs = ['course', 'vms', 'assignments']; 
      this.selectedTab = 'course';
    }
  }

  getCourses() {
    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      if (this.courses.length == 0) {
        this.router.navigate(['empty']);
      } 
      else {
        this.router.navigate([this.role, 'courses', this.courses[0].name, this.tabs[0]]);
        this.selectedCourse = this.courses[0].name;
      }
      this.sideNav.open();
    });
  }

  openLoginDialog() {
    this.urlSub = this.route.queryParams.subscribe((params) => {
      if (params['doLogin'] === 'true') {
        const dialogRef = this.loginDialog.open(LoginDialogComponent, {
          width: '320px',
        });
        
        dialogRef.afterClosed().subscribe(
          ()=> {
            if(!localStorage.getItem("jwt"))
              this.router.navigate(['home'])
          }
        )
      }
    });
  }

  openProfileDialog() {
    const dialogRef = this.profileDialog.open(ProfileDialogComponent, {
      width: '300px',
      position: { top: '64px', right: '10px' },
      backdropClass: 'backdropBackground',
    });

    dialogRef.afterClosed().subscribe(image => {
      if(image != null)
        this.createURL(image);
    });
  }

  openCourseDialog() {
    this.courseDialog.open(CourseDialogComponent, {
      width: '300px'
    });
  }

  ngOnDestroy() {
    this.urlSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
