import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginDialogComponent } from './auth/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(MatSidenav) sideNav: MatSidenav;
  title = 'ai20-lab05';

  logged: boolean = false;
  sub: Subscription;

  constructor(public dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    if(localStorage.getItem("jwt"))
      this.logged = true;

    this.routeManagement();
  }

  routeManagement() {
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
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  
  // SideNav functions
  toggleForMenuClick() {
    this.sideNav.toggle();
  }

}