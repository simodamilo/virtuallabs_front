import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {
  MatSidenav,
  throwMatDuplicatedDrawerError,
} from '@angular/material/sidenav';
import { RegistrationDialogComponent } from './auth/registration-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course, CourseService } from './core';
import { ProfileDialogComponent } from './shared/profile-dialog/profile-dialog.component';
import { LoginDialogComponent } from './auth/login-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  title = 'VirtualLabs';

  logged: boolean;
  sub: Subscription;
  courses: Course[] = [];
  selectedCourse: string;
  tabs: string[];
  role: string;
  constructor(
    private courseService: CourseService,
    public dialog: MatDialog,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.startUp();
    this.authService.isAuthenticated.subscribe((authenticated) => {
      this.logged = authenticated;
      if (authenticated === true) {
        this.setTabs();
        this.getCourses();
      }
    });
    this.routeManagement();
  }

  getCourses() {
    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.role = localStorage.getItem("role");
      if (this.courses.length == 0) {
        this.router.navigate(['empty']);
      } else {
        console.log(localStorage.getItem("role"))
        this.router.navigate([localStorage.getItem("role"), 'courses', this.courses[0].name, this.tabs[0]]);
        this.selectedCourse = this.courses[0].name;
        this.sideNav.toggle();
      }
    });
  }

  setTabs() {
    if (localStorage.getItem('role') === 'student')
      this.tabs = ['teams', 'vms', 'assignments'];
    else this.tabs = ['students', 'vms', 'assignments']; 
  }

  routeManagement() {
    this.sub = this.route.queryParams.subscribe((params) => {
      if (params['doLogin'] === 'true') {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
          width: '300px',
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setCourse(courseName: string) {
    this.selectedCourse = courseName;
  }

  openProfileDialog() {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '300px',
      position: { top: '64px', right: '10px' },
      backdropClass: 'backdropBackground',
    });
  }
}
