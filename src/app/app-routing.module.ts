import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/auth.guard';
import { TestComponent } from './test.component';

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LoginComponent},
  { path: 'teacher', 
    loadChildren: './teacher/teacher.module#TeacherModule', 
    canActivate: [AuthGuard], 
    data: { 
      expectedRole: 'teacher'
    }
  },
  { path: 'student', 
    loadChildren: './student/student.module#StudentModule', 
    canActivate: [AuthGuard],
    data: { 
      expectedRole: 'student'
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
