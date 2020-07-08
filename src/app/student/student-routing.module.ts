import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login.component';
import { TestComponent } from '../test.component';

const routes: Routes = [
    {path: 'courses/:courseName', 
        children: [
            {
            path: 'teams',
            component: TestComponent
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }