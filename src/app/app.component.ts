import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RegistrationDialogComponent } from './auth/registration-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Course, CourseService } from './core';


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
  courses$: Observable<Course[]>;
  constructor(private courseService: CourseService, public dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    if(localStorage.getItem("jwt"))
      this.logged = true;
    
    this.courses$ = this.courseService.getCourses();


    this.routeManagement();
  }

  routeManagement() {
    this.sub = this.route.queryParams.subscribe( params => {
      if(params['doRegistration'] === 'true') {
        const dialogRef = this.dialog.open(RegistrationDialogComponent, {
          width: '300px'
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(result);
          /* if(result)
          else */
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

  
  // SideNav functions
  toggleForMenuClick() {
    this.sideNav.toggle();
  }

}
