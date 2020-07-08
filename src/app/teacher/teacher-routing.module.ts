import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login.component';

const routes: Routes = [
    {path: 'courses/:courseName/', 
        children: [
            {
            path: 'students',
            component: LoginComponent
            },
            {
            path: 'vms',
            component: LoginComponent
            },
            {
            path: 'assignments',
            component: LoginComponent
            }
        ] 
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }