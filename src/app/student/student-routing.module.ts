import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login.component';
import { TestComponent } from '../test.component';
import { VmsContComponent } from './vm/vms-cont.component';
import { AssignmentComponent } from '../assignment/assignment.component';

const routes: Routes = [
    {path: 'courses/:courseName', 
        children: [
            {
            path: 'teams',
            component: TestComponent
            },
            {
            path: 'vms',
            component: VmsContComponent
            },
            {
            path: 'assignments',
            component: AssignmentComponent
            }
        ] 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }