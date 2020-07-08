import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RegistrationDialogComponent } from './auth/registration-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Course, CourseService } from './core';
import { ProfileDialogComponent } from './shared/profile-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(MatSidenav) sideNav: MatSidenav;
  title = 'VirtualLabs';
  logged: boolean = false;
  sub: Subscription;
  courses: Course[];
  selectedCourse: string;
  tabs: string[];
  role: string;
  constructor(private courseService: CourseService, public dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    this.authService.isAuthenticated.subscribe( authenticated => {
      this.logged = authenticated;
      if(authenticated === true){
        this.getCourses();
        this.setTabs();
      }
    });

    this.routeManagement();
  }

  getCourses() {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.selectedCourse = this.courses[0].name
      this.role = localStorage.getItem("role");
      if(this.role === "student")
        this.router.navigate(['student/courses',this.selectedCourse,'teams']);
      else
        this.router.navigate(['teacher/courses',this.selectedCourse,'students']);
      this.sideNav.toggle();
    });
  }

  setTabs() {
    if(localStorage.getItem("role") === "student")
      this.tabs = ['teams', 'vms', 'assignments'];
    else
      this.tabs = ['students', 'vms', 'assignments'];
  }

  routeManagement() {
    this.sub = this.route.queryParams.subscribe( params => {
      if(params['doRegistration'] === 'true') {
        const dialogRef = this.dialog.open(RegistrationDialogComponent, {
          width: '300px'
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(result);
          this.router.navigate(['home']);
        })
      }
    });
  }

  /* routeManagement() {
    this.sub = this.route.queryParams.subscribe( params => {
      
      if(params['doLogin'] === 'true') {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
          width: '300px'
        });

        dialogRef.afterClosed().subscribe(() => {
          if(localStorage.getItem("jwt")){
            this.logged = true;
            if(localStorage.getItem('nextRoute')) {
              this.router.navigate([localStorage.getItem('nextRoute')]);
              localStorage.removeItem('nextRoute');
            } else {
              this.router.navigate(['courses/teacher/course/applicazioni-internet/students']);
            }
          } else {
            this.router.navigate(['home']);
          }
        });
      } else if(params['doLogin'] === 'false') {
        this.authService.logout();
        this.logged = false;
        this.router.navigate(['home']);
      }

    });
  } */

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  setCourse(courseName: string) {
    this.selectedCourse = courseName;
  }

  openProfileDialog() {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '300px',
      position: {top: '64px', right: '10px'},
      backdropClass: 'backdropBackground'
    });
  }
}
