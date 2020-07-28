import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { StartComponent } from './start.component';
import { RegistrationComponent } from './auth/registration.component';

const routes: Routes = [
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: RegistrationComponent},
  { path: 'teacher', 
    loadChildren: './teacher/teacher.module#TeacherModule', 
    canActivate: [AuthGuard]
  },
  { path: 'student', 
    loadChildren: './student/student.module#StudentModule', 
    canActivate: [AuthGuard]
  },
  {path: 'empty', component: StartComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
