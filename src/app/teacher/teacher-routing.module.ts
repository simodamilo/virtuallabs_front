import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login.component';
import { TVmsContComponent } from './vm/t-vms-cont.component';
import { TestComponent } from '../test.component';
import { StudentsContComponent } from './students-cont.component';
import { AssignmentContComponent } from '../assignment/assignment-cont.component';

const routes: Routes = [
    {path: 'courses/:courseName', 
        children: [
            {
            path: 'students',
            component: StudentsContComponent
            },
            {
            path: 'vms',
            component: TVmsContComponent
            },
            {
            path: 'assignments',
            component: AssignmentContComponent
            }
        ] 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }